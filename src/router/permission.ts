import router from "@/router"
import { useUserStoreHook } from "@/store/modules/user"
import { usePermissionStoreHook } from "@/store/modules/permission"
import { ElMessage } from "element-plus"
import { setRouteChange } from "@/hooks/useRouteListener"
import { useTitle } from "@/hooks/useTitle"
import { getToken } from "@/utils/cache/cookies"
import routeSettings from "@/config/route"
import isWhiteList from "@/config/white-list"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

const Layouts = () => import("@/layouts/index.vue")
const loadView = (name) => import.meta.glob(`@/views/${name}.vue`)

const { setTitle } = useTitle()
NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()
  const token = getToken()

  // 如果没有登陆
  if (!token) {
    // 如果在免登录的白名单中，则直接进入
    if (isWhiteList(to)) return next()
    // 其他没有访问权限的页面将被重定向到登录页面
    return next("/login")
  }

  // 如果已经登录，并准备进入 Login 页面，则重定向到主页
  if (to.path === "/login") {
    return next({ path: "/" })
  }

  // 如果用户已经获得其权限角色
  if (userStore.roles.length !== 0) return next()

  // 否则要重新获取权限角色
  try {
    await userStore.getInfo()
    // 注意：角色必须是一个数组！ 例如: ["admin"] 或 ["developer", "editor"]
    const roles = userStore.roles
    // 生成可访问的 Routes
    routeSettings.dynamic ? permissionStore.setRoutes(roles) : permissionStore.setAllRoutes()
    // 将 "有访问权限的动态路由" 添加到 Router 中
    permissionStore.addRoutes.forEach((route) => {
      console.log(route)
      router.addRoute(route)
    })

    const menu = [
      {
        path: "/test-page",
        component: 'Layouts',
        redirect: "/table/element-plus",
        name: "testpage",
        meta: {
          title: "路由测试",
          elIcon: "Grid"
        },
        children: [
          {
            path: "test1",
            component: 'routeTest/test1/index',
            name: "test1",
            meta: {
              title: "测试",
              keepAlive: true
            }
          }
        ]
      }
    ]
    function setR(routes) {
      routes.forEach(route => {
        if (route.component === 'Layouts') {
          route.component = Layouts
        } else {
          route.component = loadView(route.component)
        }
        if (route.children) {
          setR(route.children)
        }
      })
    }
    await setR(menu)
    console.log(menu);
    
    menu.forEach(route => {
      console.log('---mmmm', route);
      router.addRoute(route)
    })

    // 确保添加路由已完成
    // 设置 replace: true, 因此导航将不会留下历史记录
    next({ ...to, replace: true })
  } catch (err: any) {
    // 过程中发生任何错误，都直接重置 Token，并重定向到登录页面
    userStore.resetToken()
    ElMessage.error(err.message || "路由守卫过程发生错误")
    next("/login")
  }
})

router.afterEach((to) => {
  setRouteChange(to)
  setTitle(to.meta.title)
  NProgress.done()
})
