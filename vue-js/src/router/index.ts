import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/license',
      name: 'license',
      component: () => import('../views/LicenseView.vue')
    },
    {
      path: '/document_scanner',
      name: 'document_scanner',
      component: () => import('../views/DocumentScannerView.vue')
    },
    {
      path: '/document_list',
      name: 'document_list',
      component: () => import('../views/DocumentListView.vue')
    },
    {
      path: '/document_detail/:id',
      name: 'document_detail',
      component: () => import('../views/DocumentDetailView.vue')
    },
    {
      path: '/document_cropping/:id',
      name: 'document_cropping',
      component: () => import('../views/DocumentCroppingView.vue')
    },
    {
      path: '/barcode_scanner/:overlay',
      name: 'barcode_scanner',
      component: () => import('../views/BarcodeScannerView.vue')
    }
  ]
})

export default router
