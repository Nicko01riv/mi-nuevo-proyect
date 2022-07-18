import React from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import { useNavigate } from "react-router-dom";
import config from './../../helpers/config.json';

const ClientsEdit = () => {
    let navigate = useNavigate();
    let clientsData = JSON.parse(sessionStorage.getItem("clients"));
    const cancel = () => {
        var { clientsName, clientsRol } = document.forms[0];
        var hasChanges = clientsName.value.length > 0 || clientsRol.value.length > 0;
        if (hasChanges) {
            if (window.confirm("Existen cambios sin guardar. ¿Seguro de querer cancelar?")) {
                navigate("/clients");
            }
        } else {
            navigate("/clients")
        }
    }

    const save = async (event) => {
        event.preventDefault();
        var { clientsName, clientsRol } = document.forms[0];
        var errors = "";
        errors += clientsName.value < 0 ? "Rellene el campo incompleto.\n" : "";
        errors += clientsRol.value < 0 ? "Rellene el campo incompleto.\n" : "";
        if (errors.length > 0) {
            window.alert("Corrija los siguientes errores:\n" + errors);
        } else {
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "operatorId": config.operatorId, "name": clientsName.value, "rol": clientsRol.value, "active": clientsData.active })
            }
            fetch(config.apiURL + "clients/" + clientsData.id, requestOptions).then((response) => {
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
                navigate("/clients");
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
                            <h1>Incorporación de Clientes</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/">Gigantes del Pacífico</a></li>
                                <li className="breadcrumb-item"><a href="/clients">Clientes</a></li>
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
                                        <input type="text" name="clientsName" id="clientsName" className="form-control" defaultValue={clientsData.name} required />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <label htmlFor="clientsRol" className="control-label">Rut del cliente</label>
                                        <input type="text" name="clientsRol" id="clientsRol" className="form-control" defaultValue={clientsData.rol} required />
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

export default ClientsEdit;
