import { Routes, Route } from 'react-router-dom';
import { routes, RouteTypes } from './routes';

export function renderChildRoutes(route: RouteTypes){
    return (
        <Route key={route.path} path={route.path} element={route.element}>
            {route.children && route.children.map(renderChildRoutes)}
        </Route>
    )
}

export default function Routers(){
    return (
        <Routes>
            {routes.map(renderChildRoutes)}
        </Routes>
    )
}