import { Route, Routes } from 'react-router'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { LazyPage } from '@/components/layout/LazyPage'
import { NOT_FOUND_ROUTE, ROUTES } from '@/routes'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        {ROUTES.map((r) => (
          <Route key={r.id} path={r.path} element={<LazyPage route={r} />} />
        ))}
        <Route path="*" element={<LazyPage route={NOT_FOUND_ROUTE} />} />
      </Route>
    </Routes>
  )
}
