vi.mock('../../api/_adminRateLimit.js',()=>({limitAdminWrites:vi.fn()}))
import { describe,it,expect,vi,beforeEach,afterEach } from 'vitest'
const mocks=vi.hoisted(()=>({
  requireAdmin:vi.fn(), create:vi.fn(), update:vi.fn(), collection:vi.fn(), transactionGet:vi.fn(), transactionSet:vi.fn(), transactionDelete:vi.fn(), save:vi.fn()
}))
vi.mock('../../api/_adminAccess.js',()=>({requireAdmin:mocks.requireAdmin}))
vi.mock('../../api/_firebaseAdmin.js',()=>({
  db:{collection:mocks.collection,runTransaction:async fn=>fn({get:mocks.transactionGet,set:mocks.transactionSet,delete:mocks.transactionDelete})},
  storage:{bucket:()=>({name:'test-bucket',file:()=>({save:mocks.save})})}
}))
import handler from '../../api/admin.js'
import { propertyInput,imageInput } from '../../api/_propertyValidation.js'
const valid=()=>({id:'new-home',nome:'Apartamento',descricao:'Descrição',preco:100,quartos:2,areaMin:30,areaMax:40,destaqueOrdem:0,marca:'vibra',prazoEntrega:'',vagaGaragem:true,suite:false,destaque:true,foto:'https://firebasestorage.googleapis.com/v0/b/test/o/a.jpg',fotos:['https://firebasestorage.googleapis.com/v0/b/test/o/a.jpg']})
function response(){return {setHeader:vi.fn(),status:vi.fn().mockReturnThis(),json:vi.fn()}}
beforeEach(()=>{
  vi.clearAllMocks();vi.stubEnv('VERCEL_ENV','preview')
  mocks.requireAdmin.mockResolvedValue({uid:'owner',email:'owner@example.com'})
  mocks.collection.mockReturnValue({doc:vi.fn(id=>({id,create:mocks.create,update:mocks.update}))})
  mocks.create.mockResolvedValue();mocks.update.mockResolvedValue()
})
afterEach(()=>vi.unstubAllEnvs())
describe('Protected admin API',()=>{
  it.each(['GET','POST','PATCH','DELETE'])('rejects unauthorized %s before database access',async method=>{
    mocks.requireAdmin.mockRejectedValue(Object.assign(new Error('No access'),{status:403}))
    const res=response();await handler({method,query:{},body:valid()},res)
    expect(res.status).toHaveBeenCalledWith(403);expect(mocks.collection).not.toHaveBeenCalled()
  })
  it('creates exclusively in the preview collection',async()=>{
    const res=response();await handler({method:'POST',query:{},body:valid()},res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(mocks.collection).toHaveBeenCalledWith('imoveis_preview')
    expect(mocks.collection).not.toHaveBeenCalledWith('imoveis')
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({id:'new-home',nome:'Apartamento'}))
  })
  it('updates managed fields without replacing the document or its public ID',async()=>{
    const res=response();await handler({method:'PATCH',query:{id:'existing'},body:{...valid(),id:'changed'}},res)
    expect(res.status).toHaveBeenCalledWith(200);expect(mocks.create).not.toHaveBeenCalled()
    expect(mocks.update.mock.calls[0][0].id).toBeUndefined()
  })
  it('returns conflict on duplicate instead of overwriting existing records',async()=>{
    mocks.create.mockRejectedValueOnce({code:6});const res=response()
    await handler({method:'POST',query:{},body:valid()},res)
    expect(res.status).toHaveBeenCalledWith(409);expect(mocks.update).not.toHaveBeenCalled()
  })
  it('archives before deleting the property',async()=>{
    mocks.transactionGet.mockResolvedValue({exists:true,id:'existing',data:()=>({nome:'Apartamento'})})
    const res=response();await handler({method:'DELETE',query:{id:'existing'}},res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(mocks.collection).toHaveBeenCalledWith('imoveis_preview_lixeira')
    expect(mocks.transactionSet).toHaveBeenCalledWith(expect.anything(),expect.objectContaining({originalId:'existing',data:{nome:'Apartamento'}}))
    expect(mocks.transactionDelete).toHaveBeenCalledTimes(1)
    expect(mocks.transactionSet.mock.invocationCallOrder[0]).toBeLessThan(mocks.transactionDelete.mock.invocationCallOrder[0])
  })
  it('never seeds production',async()=>{
    vi.stubEnv('VERCEL_ENV','production')
    const res=response();await handler({method:'POST',query:{action:'seed'}},res)
    expect(res.status).toHaveBeenCalledWith(403)
  })
})
describe('Property and upload validation',()=>{
  it.each([undefined,'','/default-placeholder.jpg'])('uses the preset for an absent cover: %s',foto=>{
    expect(propertyInput({...valid(),foto,fotos:[]})).toMatchObject({foto:'/default-placeholder.jpg',fotos:[]})
  })
  it.each([{preco:-1},{areaMax:1},{quartos:1.5},{foto:'javascript:alert(1)'},{nome:''},{fotos:Array(21).fill('https://firebasestorage.googleapis.com/v0/b/test/o/a.jpg')},{suite:'true'}])('rejects malformed property input',patch=>{
    expect(()=>propertyInput({...valid(),...patch})).toThrow()
  })
  it('ignores unrecognized fields and preserves safe description text',()=>{
    const out=propertyInput({...valid(),isAdmin:true,descricao:'<script>text only</script>'})
    expect(out.isAdmin).toBeUndefined();expect(out.descricao).toBe('<script>text only</script>')
  })
  it('rejects SVG or disguised images and oversized uploads',()=>{
    expect(()=>imageInput({type:'image/jpeg',data:Buffer.from('<svg/>').toString('base64')})).toThrow()
    expect(()=>imageInput({type:'image/svg+xml',data:Buffer.from('<svg/>').toString('base64')})).toThrow()
    expect(()=>imageInput({type:'image/jpeg',data:'A'.repeat(2800001)})).toThrow()
  })
  it('accepts supported image signatures',()=>{
    const jpeg=Buffer.from([255,216,255,224,0,1])
    expect(imageInput({type:'image/jpeg',data:jpeg.toString('base64')}).bytes).toEqual(jpeg)
  })
})
