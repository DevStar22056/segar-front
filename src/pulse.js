import Pulse from 'pulse-framework';
import React from 'react';
import {API_URL, APP_URL} from './config';
import {LANG} from "./langs";

const token = (localStorage["appState"] !== undefined) ? JSON.parse(localStorage["appState"]).user.auth_token : false;
const json_storage = (localStorage["appState"]) ? JSON.parse(localStorage["appState"]) : '';
console.log(token);

let pulse = '';

function handleError(err) {
    localStorage.removeItem('appState');
    localStorage.removeItem('_base_isAuthenticated');
}

if (token) {
    pulse = new Pulse.Library({
        config: {
            framework: React
        },
        request: {
            baseURL: API_URL,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        },
        collections: {
            translations: {
                data: {
                    pl_PL: LANG.pl_PL,
                    en_GB: LANG.en_GB
                },
                persist: ['pl_PL', 'en_GB']
            },
            projects: {
                groups: ['allProjects'],
                routes: {
                    getPerms: request => request.get('permy'),
                    getAllProjects: (request, data) => data ? request.get(`project?page=${data.page}`) : request.get('project'),
                    // getAllProjects: request => request.get('project'),
                    createProject: (request, data) => request.post('project', data),
                    updateProject: (request, data) => request.patch('project/' + data.id, data),
                    deleteProject: (request, data) => request.delete('project/' + data.id),
                    getProject: (request, data) => request.get('project/' + data.id),
                },
                actions: {
                    getAllProjects({routes, collect}, data) {
                        return routes.getAllProjects(data)
                            .then(res => res.data)
                            .then(res => {
                                collect(res.data.data, ['allProjects']);
                                return res;
                            });
                    },
                    createProject({routes, collect}, data) {
                        routes.createProject(data).then(res => {
                            // pulse.projects.purge();
                            // if (res) pulse.projects.getAllProjects();
                        });
                    },
                    updateProject({routes, collect}, data) {
                        routes.updateProject(data).then(res => {
                            // pulse.projects.purge();
                            // if (res) pulse.projects.getAllProjects();
                        });
                    },
                    deleteProject({routes, collect}, data) {
                        routes.deleteProject(data).then(res => {
                            // pulse.projects.purge();
                            // pulse.projects.getAllProjects();
                        });
                    },
                    getProject({routes, collect}, data) {
                        return routes.getProject(data)
                            .then(res => res.data)
                            .then(res => {
                                return res;
                            });
                    },
                    getPerms({routes, collect}) {
                        return routes.getPerms()
                            .then(res => res.data)
                            .then(res => {
                                return res;
                            });
                    },
                },
                data: {}
            },
            clients: {
                groups: ['clients'],
                routes: {
                    getAllClients: request => request.get('clients')
                },
                actions: {
                    getAllClients({routes, collect}) {
                        routes.getAllClients().then(res => {
                            collect(res.data, ['clients'])
                        });
                    },
                    getAllClientsPromise({routes, collect}) {
                        return routes.getAllClients()
                            .then(res => res.data)
                            .then(res => {
                                collect(res, ['clients']);
                                return res;
                            });
                    }
                },
                data: {}
            },
            currencies: {
                routes: {
                    getCurrencies: request => request.get('currencies')
                },
                actions: {
                    getCurrencies({routes}) {
                        return routes.getCurrencies()
                            .then(res => res.data)
                            .then(res => {
                                return res;
                            });
                    }
                },
                data: {}
            },
            invoices: {
                groups: ['myInvoices', 'allInvoices'],
                routes: {
                    // getMyInvoices: request => request.get('invoice'),
                    getMyInvoices: (request, data) => data ? request.get(`invoice?page=${data.page}`) : request.get('invoice'),
                    getAllInvoices: (request, data) => data ? request.get(`all-invoices?page=${data.page}`) : request.get('all-invoices'),
                    // getAllInvoices: (request) => request.get('all-invoices'),
                    createDraft: request => request.post('invoice/draft', {
                        creator: pulse.user.id,
                        user_id: pulse.user.id
                    }),
                    deleteInvoice: (request, data) => request.delete('invoice/' + data.id, data),
                    createCorrection: (request, data) => request.post('invoice/correction', data),
                    getInvoice: (request, data) => request.get('invoice/' + data.id),
                    sendToVerification: (request, data) => request.patch('invoice/' + data.id, data),
                    updateInvoice: (request, data) => request.patch('invoice/' + data.id, data),
                    getInvoiceRendered: (request, data) => request.get('invoice/' + data.id + data.type),
                    sendInvoiceViaMail: (request, data) => request.post('email/' + data.id, data)
                },
                actions: {
                    getMyInvoices({routes, collect}, data) {
                        return routes.getMyInvoices(data)
                            .then(res => res)
                            .then(res => {
                                collect(res.data, ['myInvoices']);
                                return res;
                            });
                    },
                    getAllInvoices({routes, collect}, data) {
                        return routes.getAllInvoices(data)
                            .then(res => res);
                    },
                    createDraft({routes, collect}) {
                        routes.createDraft().then(res => {
                            pulse.invoices.purge();
                            pulse.invoices.getMyInvoices();
                            window.location = '/invoices/show/' + res.id;
                        })
                    },
                    createCorrection({routes}, data) {
                        routes.createCorrection(data).then(res => {
                            // console.log(res)
                            window.location = '/invoices/show/' + res.id;
                        })
                    },
                    updateInvoice({routes, collect}, data) {
                        return routes.updateInvoice(data)
                            .then(res => res)
                            .catch(err => {
                                if(err.status === 404) {
                                    alert("Wystąpił błąd z zapisem danych...")
                                    window.location.reload();
                                }
                                return err;
                            });
                    },
                    getInvoice({routes}, data) {
                        return routes.getInvoice(data)
                            .then(res => res)
                            .then(res => res)
                            .catch(e => e);
                    },
                    getInvoiceRendered({routes}, data) {
                        return routes.getInvoiceRendered(data);
                    },
                    sendToVerification({routes}, data) {
                        return routes.sendToVerification(data).then(
                            res => {
                                if (res.status === 'success') {
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 300)
                                }
                            }
                        );
                    },
                    sendInvoiceViaMail({routes}, data) {
                        return routes.sendInvoiceViaMail(data).then(res => res);
                    },
                    deleteInvoice({routes}, data) {
                        return routes.deleteInvoice(data)
                            .then(res => {
                                if (res.data === 'success') {
                                    setTimeout(() => {
                                        window.location = APP_URL + 'admin/invoices';
                                    }, 100)
                                } else {
                                    handleError()
                                }
                            })
                    }
                },
                data: {}
            },
            users: {
                groups: ['allUsers', 'user'],
                routes: {
                    getAllUsers: (request, data) => data ? request.get(`user?page=${data.page}`) : request.get('user'),
                    getUser: (request, data) => request.get('user/' + data.id),
                    updateUser: (request, data) => request.patch('user/' + data.id, data),
                    deleteUser: (request, data) => request.delete('user/' + data.id, data),
                },
                actions: {
                    getAllUsers({routes, collect}, data) {
                        return routes.getAllUsers(data)
                            .then(res => res)
                            .then(res => {
                                collect(res.data.data, ['allUsers']);
                                return res.data;
                            });
                    },
                    getUser({routes, collect, deleteGroup}, data) {
                        return routes.getUser(data)
                            .then(res => res)
                            .then(res => {
                                pulse.users.deleteGroup('user'); // remove collected user
                                collect(res.data, 'user');
                                return res;
                            });
                    },
                    updateUser({routes, collect}, data) {
                        return routes.updateUser(data)
                            .then(res => res)
                            .then(res => {
                                return res
                            });
                    },
                    deleteUser({routes}, data) {
                        return routes.deleteUser(data)
                            .then(res => {
                                if (res.data === 'success') {
                                    setTimeout(() => {
                                        window.location = APP_URL + 'admin/users';
                                    }, 100)
                                } else {
                                    handleError()
                                }
                            })
                    }
                },
                data: {}
            },
            gus: {
                routes: {
                    getDataByNIP: (request, data) => request.post('nip', data)
                },
                actions: {
                    getDataByNIP({routes, collect}, data) {
                        return routes.getDataByNIP(data)
                            .then(res => res)
                            .then(res => {
                                return res;
                            });
                    },
                }
            },
            files: {
                routes: {
                    // getFiles: request => request.get('contractor'),
                    deleteFile: (request, data) => request.delete('fileupload/' + data.id, data),
                },
                actions: {
                    deleteFile({routes}, data) {
                        return routes.deleteFile(data)
                            .then(res => res)
                            .then(res => {
                                return res;
                            })
                    },
                }
            },
            contractors: {
                groups: ['contractors'],
                routes: {
                    getAllContractors: request => request.get('contractor'),
                    findContractor: (request, data) => request.post('hrm-candidates', data),
                    registerUserFromContractors: (request, data) => request.post('register-contractor', data),
                    // getContractors: request => request.get('contractors'),
                    getContractors: (request, data) => data ? request.get(`contractors?page=${data.page}`) : request.get('contractors'),
                    getContractor: (request, data) => request.get('contractors/' + data.id),
                    createContractor: (request, data) => request.post('contractors', data),
                    updateContractor: (request, data) => request.patch('contractors/' + data.id, data),
                    deleteContractor: (request, data) => request.delete('contractors/' + data.id, data),
                },
                actions: {
                    getAllContractors({routes, collect}) {
                        return routes.getAllContractors()
                            .then(res => res)
                            .then(res => {
                                collect(res.data, 'contractors');
                                return res.data;
                            });
                    },
                    findContractor({routes, collect}, data) {
                        return routes.findContractor(data)
                            .then(res => res)
                            .then(res => {
                                return res;
                            });
                    },
                    registerUserFromContractors({routes, collect}, data) {
                        return routes.registerUserFromContractors(data)
                            .then(res => res)
                            .then(res => {
                                if (res.success) {
                                    pulse.users.purge();
                                    pulse.users.getAllUsers();
                                }
                                return res;
                            })
                            .catch(err => {
                                // if (err.status === 404) {
                                //     alert('Kontraktor z takim ID już istnieje w systemie.')
                                // }
                                return err;
                            });
                    },
                    getContractors({routes, collect}, data) {
                        return routes.getContractors(data)
                            .then(res => res)
                            .then(res => {
                                collect(res.data, 'contractors');
                                return res;
                            });
                    },
                    getContractor({routes, collect}, data) {
                        return routes.getContractor(data);
                    },
                    createContractor({routes, collect}, data) {
                        return routes.createContractor(data);
                    },
                    updateContractor({routes, collect}, data) {
                        return routes.updateContractor(data);
                    },
                    deleteContractor({routes}, data) {
                        return routes.deleteContractor(data)
                            .then(res => {
                                if (res.data === 'success') {
                                    setTimeout(() => {
                                        window.location = APP_URL + 'admin/contractors';
                                    }, 100)
                                } else {
                                    handleError()
                                }
                            })
                    }
                },
                data: {}
            },
            countries: {
                groups: ['countriesList'],
                routes: {
                    getCountriesList: request => request.get('countries')
                },
                actions: {
                    getCountriesList({routes, collect}) {
                        return routes.getCountriesList()
                            .then(res => {
                                collect(res.data, 'countriesList');
                                return res.data;
                            });
                    },
                },
                data: {}
            },
            timesheets: {
                groups: ['timesheets'],
                routes: {
                    getTimesheets: request => request.get('timesheets')
                },
                actions: {
                    getTimesheets({routes, collect}) {
                        return routes.getTimesheets()
                            .then(res => {
                                collect(res.data, 'timesheets');
                                return res.data;
                            });
                    },
                },
                data: {}
            },
            candidate: {
                routes: {
                    selfUpdate: (request, data) => request.post('user-form/' + data.id, data)
                },
                actions: {
                    selfUpdate({routes, collect}, data) {
                        routes.selfUpdate(data);
                    },
                }
            },
            user: {
                groups: ['userData'],
                routes: {
                    sendUserDataChangeRequest: (request, data) => request.post('candidate-update', data),
                    sendUserDataChangeUpdate: (request, data) => request.patch('candidate-update/' + data.id, data),
                    removeChangeRequest: (request, data) => request.delete('candidate-update/' + data.id),
                    updateChangeRequest: (request, data) => request.patch('candidate-update/' + data.id, data),
                    getUserData: request => request.get('auth-user'),
                    getUserEquipment: request => request.get('device'),
                    updateLanguage: (request, data) => request.patch('user/' + data.id, data),
                    addBankAccountRequest: (request, data) => request.post('add-account', data),
                    addContactRequest: (request, data) => request.post('add-contact', data),
                    addAgreementRequest: (request, data) => request.post('add-agreement', data),
                },
                actions: {
                    getUserData({routes, collect}) {

                        return routes.getUserData()
                            .then(res => res)
                            .then(res => {
                                collect(res, 'userData');
                                return res
                            }).catch(
                                err => {
                                    handleError();
                                    pulse.user.purge();
                                    // alert('!');
                                    setTimeout(() => {
                                        // window.location.reload();
                                    }, 200)
                                }
                            );
                    },
                    getUserEquipment({routes, collect}) {
                        routes.getUserEquipment();
                    },
                    updateLanguage({routes}, data) {
                        return routes.updateLanguage(data).then(res => res);
                    },
                    sendUserDataChangeRequest({routes}, data) {
                        return routes.sendUserDataChangeRequest(data).then(
                            res => {
                                if (res.data === 'success') {
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 300)
                                }
                            }
                        )
                    },
                    addBankAccountRequest({routes}, data) {
                        return routes.addBankAccountRequest(data).then(
                            res => {
                                if (res.data === 'success') {
                                    return 'success';
                                    // setTimeout(() => {
                                    //     // window.location.reload();
                                    // }, 600)
                                }
                            }
                        )
                    },
                    addContactRequest({routes}, data) {
                        return routes.addContactRequest(data).then(
                            res => {
                                if (res.data === 'success') {
                                    return 'success';
                                    // setTimeout(() => {
                                    //     // window.location.reload();
                                    // }, 600)
                                }
                            }
                        )
                    },
                    addAgreementRequest({routes}, data) {
                        return routes.addAgreementRequest(data).then(
                            res => {
                                if (res.data === 'success') {
                                    return 'success';
                                    // setTimeout(() => {
                                    //     // window.location.reload();
                                    // }, 600)
                                }
                            }
                        )
                    },
                    removeChangeRequest({routes}, data) {
                        return routes.removeChangeRequest(data)
                            .then(res => console.log(res))
                    },
                    updateChangeRequest({routes}, data) {
                        return routes.updateChangeRequest(data)
                            .then(res => console.log(res))
                    },
                },
                data: {
                    id: json_storage.user.user_id,
                    role: parseInt(json_storage.user.role),
                    is_active: json_storage.user.is_active,
                    drawerIsOpen: (json_storage.user.role === 1),
                    token: token
                }
            },
            devices: {
                routes: {
                    createDevice: (request, data) => request.post('device', data),
                    updateDevice: (request, data) => request.patch('device/' + data.id, data),
                    deleteDevice: (request, data) => request.delete('device/' + data.id, data),
                },
                actions: {
                    createDevice({routes, collect}, data) {
                        return routes.createDevice(data)
                            .then(res => res.data)
                            .then(res => {
                                return res;
                            });
                    },
                    updateDevice({routes, collect}, data) {
                        routes.updateDevice(data);
                    },
                    deleteDevice({routes}, data) {
                        routes.deleteDevice(data);
                    },
                },
            },
            rates: {
                routes: {
                    getRate: (request, data) => request.get('invoice-contractor/' + data.id),
                    createRate: (request, data) => request.post('invoice-contractor', data),
                    updateRate: (request, data) => request.patch('invoice-contractor/' + data.id, data),
                    deleteRate: (request, data) => request.delete('invoice-contractor/' + data.id, data),
                },
                actions: {
                    createRate({routes, collect}, data) {
                        return routes.createRate(data)
                            .then(res => res.data)
                            .then(res => {
                                return res;
                            });
                    },

                    getRate({routes, collect}, data) {
                        return routes.getRate(data).then(res => res).then(res => {
                            return res
                        });
                    },
                    deleteRate({routes}, data) {
                        routes.deleteRate(data).then(res => {

                        });
                    },
                },
            },
            faq: {
                groups: ['faq'],
                routes: {
                    getFaqItems: request => request.get('faq'),
                    createFaqItem: (request, data) => request.post('faq', data),
                    updateFaqItem: (request, data) => request.patch('faq/' + data.id, data),
                    deleteFaqItem: (request, data) => request.delete('faq/' + data.id),
                },
                actions: {
                    getFaqItems({routes, collect}) {
                        return routes.getFaqItems()
                            .then(res => res.data)
                            .then(res => {
                                collect(res.data, 'faq');
                                return res;
                            });
                    },
                    createFaqItem({routes, collect}, data) {
                        routes.createFaqItem(data);
                    },
                    updateFaqItem({routes, collect}, data) {
                        routes.updateFaqItem(data);
                    },
                    deleteFaqItem({routes}, data) {
                        routes.deleteFaqItem(data);
                    },
                },
            },
            sellers: {
                groups: ['allSellers'],
                routes: {
                    getSellers: (request, data) => data ? request.get(`sellers?page=${data.page}`) : request.get('sellers'),
                    // getSellers: request => request.get('sellers'),
                    getSeller: (request, data) => request.get('sellers/' + data.id),
                    createSeller: (request, data) => request.post('sellers', data),
                    updateSeller: (request, data) => request.patch('sellers/' + data.id, data),
                    deleteSeller: (request, data) => request.delete('sellers/' + data.id),
                },
                actions: {
                    getSellers({routes, collect}, data) {
                        return routes.getSellers(data)
                            .then(res => res)
                            .then(res => {
                                collect(res.data, ['allSellers']);
                                return res;
                            });
                    },
                    getSeller({routes, collect}, data) {
                        return routes.getSeller(data);
                    },
                    createSeller({routes, collect}, data) {
                        return routes.createSeller(data);
                    },
                    updateSeller({routes, collect}, data) {
                        return routes.updateSeller(data);
                    },
                    deleteSeller({routes}, data) {
                        routes.deleteSeller(data);
                    },
                },
            },
            purchasers: {
                groups: ['purchasers'],
                routes: {
                    getPurchasers: request => request.get('purchasers'),
                    createPurchaser: (request, data) => request.post('purchasers', data),
                    updatePurchaser: (request, data) => request.patch('purchasers/' + data.id, data),
                    deletePurchaser: (request, data) => request.delete('purchasers/' + data.id),
                },
                actions: {
                    getPurchasers({routes, collect}) {
                        return routes.getPurchasers()
                            .then(res => res)
                            .then(res => {
                                collect(res.data, 'purchasers');
                                return res.data;
                            });
                    },
                    createPurchaser({routes}, data) {
                        return routes.createPurchaser(data).then(res => res.data).then(res => {
                            return res
                        });
                    },
                    updatePurchaser({routes}, data) {
                        return routes.updatePurchaser(data).then(res => res.data).then(res => {
                            return res
                        });
                    },
                    deletePurchaser({routes}, data) {
                        return routes.deletePurchaser(data).then(res => res.data).then(res => {
                            return res
                        });
                    },
                },
            },
        }
    });

    // for users
    pulse.user.getUserData();
    pulse.base.isAuthenticated = true;

} else {
    pulse = new Pulse.Library({
        collections: {
            translations: {
                data: {
                    pl_PL: LANG.pl_PL,
                    en_GB: LANG.en_GB
                },
                persist: ['pl_PL', 'en_GB']
            },
            user: {
                data: {
                    drawerIsOpen: false
                }
            },
            invoice : {
                data : {}
            },
            lang: ''
        }
    });
}

// default lang
if (localStorage['lang'] === undefined) {
    localStorage['lang'] = 'pl_PL'
}

pulse.lang = localStorage['lang'];

// set text obj
pulse.text = pulse.translations[localStorage['lang']];
pulse._text = pulse.translations['en_GB'];

export default pulse;