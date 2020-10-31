import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './core/Home';
import Signup from './user/Signup';
import Signin from './user/Signin';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';
import Dashboard from './user/UserDashboard';
import AdminDashboard from './admin/AdminDashboard';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';

const Routes = () => {
    return (<BrowserRouter>
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/signin" exact component={Signin} />
            <Route path="/signup" exact component={Signup} />
            <PrivateRoute path="/user/dashboard" component={Dashboard}/>
            <AdminRoute path="/admin/dashboard" component={AdminDashboard}/>
            <AdminRoute path="/create/category" component={AddCategory}/>
            <AdminRoute path="/create/product" component={AddProduct}/>
        </Switch>
    </BrowserRouter>)
};
 
export default Routes;