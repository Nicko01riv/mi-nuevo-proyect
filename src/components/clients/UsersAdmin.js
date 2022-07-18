import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import { Link, useNavigate } from "react-router-dom";
import config from './../../helpers/config.json';

const UsersAdmin = () => {
    let navigate = useNavigate();
    const [rowsData, setRows] = useState(0);
    useEffect(() => {
        updateUsers();
    });

    const updateUsers = () => {
        const requestOptions = {
            method: 'GET', headers: { 'Content-Type': 'application/json'}
        };
        fetch(config.apiURL+"users/"+config.operatorId, requestOptions).then((response) => {
            return response.json();
        }).then((result) => {
            
            let usersList = result.data.map((users) => { return users; });
            let rowData;
            if(usersList.length === 0){
                rowData = (<tr><td colSpan="4" className="text-center">No existen Usuarios</td></tr>);
            } else {
                rowData = usersList.map(p => {
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

    const disable = (users) => {
        if(window.confirm("¿Está seguro/a de querer deshabilitar:\n"+users.name)){
            const requestOptionsPatch = {
                method: 'PUT', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({
                    operatorId: config.operatorId,
                    name: users.name,
                    nickname: users.apodo,
                    password: users.clave,
                    level: users.admin,
                })
            };
            fetch(config.apiURL+"users/"+users.id, requestOptionsPatch).then((response) => {
                return response.json();
            }).then((result) => {
                updateUsers();
                window.alert("Deshabilitación completada");
            });   
        }
    }
    const enable = (users) => {
        if(window.confirm("¿Está seguro/a de querer volver a habilitar:\n"+users.name)){
            const requestOptionsPatch = {
                method: 'PUT', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({
                    operatorId: config.operatorId,
                    name: users.name,
                    nickname: users.apodo,
                    password: users.clave,
                    level: users.admin,
                    active: false
                })
            };
            fetch(config.apiURL+"users/"+users.id, requestOptionsPatch).then((response) => {
                return response.json();
            }).then((result) => {
                updateUsers();
                window.alert("Habilitación completada")
            });   
        }
    }
    const edit = (users) => {
        let usersData = JSON.stringify(users);
        sessionStorage.setItem("users", usersData);
        navigate("/users/edit");
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
                                <h1>Contenedor de Usuarios</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><a href="/">Gigantes del Pacífico</a></li>
                                    <li className="breadcrumb-item active">Usuarios</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    </section>
                    <section className="content">
                        <div className="card">
                            <div className="card-header">
                                <Link to="/users/add" className="btn btn-success"><i className="fas fa-plus"></i> Nuevo</Link>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Usuarios</th>
                                                <th>Apodo</th>
                                                <th>Clave</th>
                                                <th>Level</th>
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
export default UsersAdmin;