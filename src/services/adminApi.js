import axios from 'axios'
import { getAuth } from 'firebase/auth'
import { firebaseApp } from '../firebase'
export const adminAuth = getAuth(firebaseApp)
export async function adminRequest(method = 'get', options = {}) {
  await adminAuth.authStateReady()
  const user = adminAuth.currentUser
  if (!user) throw new Error('Entre na sua conta para continuar.')
  const token = await user.getIdToken()
  try {
    const response = await axios({ url: '/api/admin', method, ...options, headers: { Authorization: 'Bearer ' + token }, timeout: 60000 })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Não foi possível concluir. Verifique sua conexão e tente novamente.')
  }
}
export async function prepareImage(file) {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 15 * 1024 * 1024) throw new Error('Use JPG, PNG ou WebP de até 15 MB.')
  const url = URL.createObjectURL(file)
  try {
    const image = await new Promise((resolve,reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Não foi possível abrir esta imagem.'))
      img.src = url
    })
    const ratio = Math.min(1, 1800 / Math.max(image.width,image.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1,Math.round(image.width * ratio))
    canvas.height = Math.max(1,Math.round(image.height * ratio))
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.drawImage(image,0,0,canvas.width,canvas.height)
    const result = canvas.toDataURL('image/jpeg',.85).split(',')[1]
    if (result.length > 2800000) throw new Error('A imagem ainda está grande. Escolha uma versão menor.')
    return { type:'image/jpeg', data:result }
  } finally { URL.revokeObjectURL(url) }
}
