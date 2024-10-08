import React from 'react';
import { useGetSolicitudesQuery } from '../../features/RequestService/RequestServiceApiSlice';
import logo from '../../assets/images/Logo-removebg-preview.png';
export default function Invoice() {
    const { data: solicitudes, isLoading, isError } = useGetSolicitudesQuery();

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading solicitudes</p>;

    return (
        <div className="invoice-1 invoice-wrapper">
            <div className="invoice-wrapper container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="invoice-inner clearfix">
                            <div className="invoice-info clearfix" id="invoice_wrapper">
                                <div className="invoice-headar">
                                    <div className="row g-0">
                                        <div className="col-sm-6">
                                            <div className="invoice-logo">
                                                <img
                                                    src={logo}
                                                    alt="logo"
                                                    className="logo"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 invoice-id">
                                            <div className="info">
                                                <h1 className="invoice-wrapper color-white inv-header-1">Invoice</h1>
                                                <p className="invoice-wrapper color-white mb-1">
                                                    Invoice Number <span>#45613</span>
                                                </p>
                                                <p className="invoice-wrapper color-white mb-0">
                                                    Invoice Date <span>21 Sep 2021</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="invoice-top">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="invoice-number invoice-wrapper mb-30">
                                                <h4 className="invoice-wrapper inv-title-1">Invoice To</h4>
                                                <h2 className="invoice-wrapper name mb-10">Jhon Smith</h2>
                                                <p className="invoice-wrapper invo-addr-1">
                                                    Theme Vessel <br />
                                                    info@themevessel.com <br />
                                                    21-12 Green Street, Meherpur, Bangladesh <br />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="invoice-number invoice-wrapper mb-30">
                                                <div className="invoice-number-inner">
                                                    <h4 className="invoice-wrapper inv-title-1">Invoice From</h4>
                                                    <h2 className="invoice-wrapper name mb-10">Animas Roky</h2>
                                                    <p className="invoice-wrapper invo-addr-1">
                                                        Apexo Inc <br />
                                                        billing@apexo.com <br />
                                                        169 Teroghoria, Bangladesh <br />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dropdown (Combo Box) */}
                                    <div className="row">
                                        <div className="col-sm-12 mb-30">
                                            <label htmlFor="solicitudSelect">Select Solicitud:</label>
                                            <select id="solicitudSelect" className="form-control">
                                                <option value="">-- Seleccionar Solicitud --</option>
                                                {solicitudes?.map((solicitud) => (
                                                    <option key={solicitud.id_solicitud} value={solicitud.id_solicitud}>
                                                        {solicitud.id_solicitud} - {solicitud.nombre} {solicitud.apellido}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="invoice-center">
                                    <div className="table-responsive">
                                        <table className="invoice-wrapper table mb-0 table-striped invoice-table">
                                            <thead className="bg-active">
                                                <tr className="tr">
                                                    <th>No.</th>
                                                    <th className="pl0 text-start">Item Description</th>
                                                    <th className="text-center">Price</th>
                                                    <th className="text-center">Quantity</th>
                                                    <th className="text-end">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="tr">
                                                    <td>
                                                        <div className="invoice-wrapper item-desc-1">
                                                            <span>01</span>
                                                        </div>
                                                    </td>
                                                    <td className="pl0">Businesscard Design</td>
                                                    <td className="text-center">$300</td>
                                                    <td className="text-center">2</td>
                                                    <td className="text-end">$600.00</td>
                                                </tr>
                                                <tr className="tr">
                                                    <td>
                                                        <div className="invoice-wrapper item-desc-1">
                                                            <span>03</span>
                                                        </div>
                                                    </td>
                                                    <td className="pl0">Application Interface Design</td>
                                                    <td className="text-center">$240</td>
                                                    <td className="text-center">3</td>
                                                    <td className="text-end">$720.00</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="invoice-bottom">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-8 col-sm-7">
                                            <div className="invoice-wrapper mb-30 dear-client">
                                                <h3 className="invoice-wrapper inv-title-1">Terms & Conditions</h3>
                                                <p>
                                                    Lorem Ipsum is simply dummy text of the printing and
                                                    typesetting industry. Lorem Ipsum has been typesetting
                                                    industry. Lorem Ipsum
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-4 col-sm-5">
                                            <div className="invoice-wrapper mb-30 payment-method">
                                                <h3 className="invoice-wrapper inv-title-1">Payment Method</h3>
                                                <ul className="invoice-wrapper payment-method-list-1 text-14">
                                                    <li>
                                                        <strong>Account No:</strong> 00 123 647 840
                                                    </li>
                                                    <li>
                                                        <strong>Account Name:</strong> Jhon Doe
                                                    </li>
                                                    <li>
                                                        <strong>Branch Name:</strong> xyz
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="invoice-contact clearfix">
                                    <div className="row g-0">
                                        <div className="col-lg-9 col-md-11 col-sm-12">
                                            <div className="invoice-wrapper contact-info">
                                                <a href="tel:+55-4XX-634-7071">
                                                    <i className="fa fa-phone"></i> +00 123 647 840
                                                </a>
                                                <a href="mailto:info@themevessel.com">
                                                    <i className="fa fa-envelope"></i> info@themevessel.com
                                                </a>
                                                <a
                                                    href="mailto:info@themevessel.com"
                                                    className="mr-0 d-none-580"
                                                >
                                                    <i className="fa fa-map-marker"></i> 169 Teroghoria,
                                                    Bangladesh
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="invoice-btn-section clearfix d-print-none">
                                    <button
                                        onClick={() => window.print()}
                                        className="invoice-wrapper btn btn-lg btn-print"
                                    >
                                        <i className="fa fa-print"></i> Print Invoice
                                    </button>
                                    <button className="invoice-wrapper btn btn-lg btn-download btn-theme">
                                        <i className="fa fa-download"></i> Download Invoice
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
