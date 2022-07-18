import React from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import config from './../../helpers/config.json';

const UsersEdit = () => {
    let navigate = useNavigate();
    let usersData = JSON.parse(sessionStorage.getItem("users"));
    const cancel = () => {
        var { usersName, usersApodo, usersClave, usersAdmin } = document.forms[0];
        var hasChanges = usersName.value.length > 0 || usersApodo.value.length > 0 || usersClave > 0 || usersAdmin > 0;
        if (hasChanges) {
            if (window.confirm("Existen cambios sin guardar. ¿Seguro de querer cancelar?")) {
                navigate("/users");
            }
        } else {
            navigate("/users")
        }
    }

    const save = async (event) => {
        event.preventDefault();
        var { usersName, usersApodo, usersClave, usersAdmin } = document.forms[0];
        var errors = "";
        errors += usersName.value < 0 ? "Rellene el campo incompleto.\n" : "";
        errors += usersApodo.value < 0 ? "Rellene el campo incompleto.\n" : "";
        errors += usersClave.value < 0 ? "Rellene el campo incompleto.\n" : "";
        errors += usersAdmin.value < 0 ? "Rellene el campo incompleto.\n" : "";
        if (errors.length > 0) {
            window.alert("Corrija los siguientes errores:\n" + errors);
        } else {
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "operatorId": config.operatorId, "name": usersName.value, "nickname": usersApodo.value, "password": usersClave, "level": usersAdmin, "active": usersData})
            }
            fetch(config.apiURL + "users/" + usersData.id, requestOptions).then((response) => {
                switch (response.status) {
                    case 400:
                        console.log("consulta mal formada");
                        break;
                    case 403:
                        console.log("acceso prohibido");
                        break;
                    default:
                    //
                }
                return response.json();
            }).then((result) => {
                window.alert("Actualizacion existosa");
                navigate("/users");
            })
        }
    }
    return (<div>
        <Topbar />
        <Sidebar />
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Incorporación de Usuarios</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/">Gigantes del Pacífico</a></li>
                                <li className="breadcrumb-item"><a href="/clients">Usuarios</a></li>
                                <li className="breadcrumb-item active">Agregar</li>
                            </ol>
                        </div>
                    </div>
                </div>

            </section>
            <section className="content">
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={save}>
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group">
                                        <label htmlFor="clientsName" className="control-label">Nombre</label>
                                        <input type="text" name="clientsName" id="clientsName" className="form-control" defaultValue={usersData.name} required />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <label htmlFor="usersApodo" className="control-label">Apodo</label>
                                        <input type="text" name="usersApodo" id="usersApodo" className="form-control" defaultValue={usersData.rol} required />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <label htmlFor="usersClave" className="control-label">Clave</label>
                                        <input type="password" name="usersClave" id="usersClave" className="form-control" defaultValue={usersData.rol} required />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <label htmlFor="usersLevel" className="control-label">Level</label>
                                        <input type="text" name="usersLevel" id="usersLevel" className="form-control" defaultValue={usersData.rol} required />
                                    </div>
                                </div>
                                <div className="col-4">
                                </div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <button type="button" onClick={cancel} className="btn btn-secondary"><i className="fas fa-times"></i> Cancelar</button>
                                <button type="submit" className="btn btn-primary"><i className="fas fa-save"></i> Guardar</button>
                            </div>
                        </form>
                    </div >
                </div >
            </section >
        </div >
    </div >
    )
}

export default UsersEdit;
