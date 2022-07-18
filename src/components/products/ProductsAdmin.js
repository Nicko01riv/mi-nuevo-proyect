import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import { Link, useNavigate } from "react-router-dom";
import config from './../../helpers/config.json';

const ProductsAdmin = () => {
    let navigate = useNavigate();
    const [rowsData, setRows] = useState(0);
    useEffect(() => {
        updateProducts();
    });

    const updateProducts = () => {
        const requestOptions = {
            method: 'GET', headers: { 'Content-Type': 'application/json'}
        };
        fetch(config.apiURL+"products/"+config.operatorId, requestOptions).then((response) => {
            return response.json();
        }).then((result) => {
            
            let productList = result.data.map((product) => { return product; });
            let rowData;
            if(productList.length === 0){
                rowData = (<tr><td colSpan="4" className="text-center">No existen productos</td></tr>);
            } else {
                rowData = productList.map(p => {
                    let button;
                    if(p.active){
                        button = <button className="btn btn-secondary" onClick={() => disable(p)}><i className="fas fa-eye-slash"></i> Deshabilitar</button>;
                    } else {
                        button = <button className="btn btn-primary" onClick={() => enable(p)}><i className="fas fa-eye"></i> Habilitar</button>;
                    }
                    
                    return (<tr>
                        <td>{p.name}</td><td className="text-right">${p.price}</td><td className="text-right">{p.stock}</td>
                        <td className="d-flex justify-content-between">
                            {button}
                            <button className="btn btn-warning" onClick={() => edit(p)}><i className="fas fa-pencil"></i> Editar</button>
                        </td>
                    </tr>); 
                });
            }
            setRows(rowData);
        });
    };

    const disable = (product) => {
        if(window.confirm("¿Está seguro/a de querer deshabilitar:\n"+product.name)){
            const requestOptionsPatch = {
                method: 'PUT', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({
                    operatorId: config.operatorId,
                    name: product.name,
                    MSU: parseInt(product.MSU),
                    price: parseInt(product.price),
                    stock: parseInt(product.stock),
                    MDPrice: parseInt(product.MDPrice),
                    MDPercentage: parseInt(product.MDPercentage),
                    active: false
                })
            };
            fetch(config.apiURL+"products/"+product.id, requestOptionsPatch).then((response) => {
                return response.json();
            }).then((result) => {
                updateProducts();
                window.alert("Deshabilitación completada");
            });   
        }
    }
    const enable = (product) => {
        if(window.confirm("¿Está seguro/a de querer volver a habilitar:\n"+product.name)){
            const requestOptionsPatch = {
                method: 'PUT', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({
                    operatorId: config.operatorId,
                    name: product.name,
                    MSU: parseInt(product.MSU),
                    price: parseInt(product.price),
                    stock: parseInt(product.stock),
                    MDPrice: parseInt(product.MDPrice),
                    MDPercentage: parseInt(product.MDPercentage),
                    active: true
                })
            };
            fetch(config.apiURL+"products/"+product.id, requestOptionsPatch).then((response) => {
                return response.json();
            }).then((result) => {
                updateProducts();
                window.alert("Habilitación completada")
            });   
        }
    }
    const edit = (product) => {
        let productData = JSON.stringify(product);
        sessionStorage.setItem("product", productData);
        navigate("/products/edit");
    }
    
    return (
        <div>
                <Topbar />
                <Sidebar />
                <div className="content-wrapper">
                    <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Panel de Ventas</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><a href="/">Gigantes del Pacífico</a></li>
                                    <li className="breadcrumb-item active">Productos</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    </section>
                    <section className="content">
                        <div className="card">
                            <div className="card-header">
                                <Link to="/products/add" className="btn btn-success"><i className="fas fa-plus"></i> Nuevo</Link>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Precio Unitario</th>
                                                <th>Stock Actual</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                                {rowsData}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
    );
}
export default ProductsAdmin;


