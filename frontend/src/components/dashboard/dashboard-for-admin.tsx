import React, { useEffect, useState } from 'react'
import LargeCard from './large-card'
import { DashboardModel } from '../../models/dashboardModel'
import { INIT_DASHBOARD, apiClient } from '../../config'
import ReactApexChart from 'react-apexcharts'
import ProfileAvatar from '../profile-avatar'

function DashboardForAdmin() {
    const [dashboardData, setDashboardData] = useState<DashboardModel>(INIT_DASHBOARD)

    useEffect(() => {
        fetchData()
    }, [])


    const fetchData = async () => {
        try {
            const res = await apiClient.get<DashboardModel>('/dashboard')
            setDashboardData(res.data)
            initBarChart(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const progressPercentage = (dashboardData.totalNumberCompletedProjects / dashboardData.totalNumberProjects) * 100;

    const activeUsersPercentage = (dashboardData.totalNumberActiveUsers / dashboardData.totalNumberUsers) * 100;

    const initBarChart = (dashboardData: DashboardModel) => {
        const categories = dashboardData.barchart.map((item) => item.company)
        const data = dashboardData.barchart.map((item) => item.projectCount)

        // const sorted = data.sort((a, b) => a - b)
        const sorted = data.slice().sort((a, b) => a - b);


        const min = sorted[0]
        const max = sorted[sorted.length - 1]

        const grayColor = "rgb(161, 172, 184)"
        const grayColorLight = "rgba(161, 172, 184, 0.2)"

        const options = {
            chart: { height: 220, type: "bar", toolbar: !1, dropShadow: { enabled: !0, top: 14, left: 2, blur: 3, color: "#696cff", opacity: .15 } },
            series: [{ data: data }],
            dataLabels: { enabled: !1 },
            stroke: { width: 3, curve: "smooth" },
            colors: ["#696cff"],
            fill: {
                type: "gradient",
                gradient: { shade: grayColor, shadeIntensity: .8, opacityFrom: .7, opacityTo: .25, stops: [0, 95, 100] }
            },
            grid: { show: !0, borderColor: grayColorLight, padding: { top: -15, bottom: -10, left: 0, right: 0 } },
            xaxis: {
                categories: categories,
                labels: { offsetX: 0, style: { colors: grayColor, fontSize: "13px" } },
                axisBorder: { show: !1 },
                axisTicks: { show: !1 },
                lines: { show: !1 }
            },
            yaxis: { labels: { offsetX: -10, formatter: function (value: number) { return value.toFixed(0) }, style: { fontSize: "13px", colors: grayColor } }, min: min - 1, max: max + 1 }
        }

        var chart = new ApexCharts(document.querySelector("#totalIncomeChart"), options);
        chart.render();
    }
    return (
        <div className="container-xxl flex-grow-1 container-p-y">

            <div className="row">
                <LargeCard
                    icon={<span className="badge bg-label-warning rounded p-2"><i className="bx bx-user bx-sm"></i></span>}
                    title="Users"
                    value={dashboardData.totalNumberUsers}
                />
                <LargeCard
                    icon={<span className="badge bg-label-success rounded p-2"> <i className="bx bx-user bx-sm"></i></span>}
                    title="Active users"
                    value={dashboardData.totalNumberActiveUsers}
                />
                <LargeCard
                    icon={<span className="badge bg-label-primary rounded p-2"><i className="bx bxs-spreadsheet bx-sm"></i></span>}
                    title="Projects"
                    value={dashboardData.totalNumberProjects}
                />
                <LargeCard
                    icon={<span className="badge bg-label-success rounded p-2"><i className="bx  bx-check-square bx-sm"></i></span>}
                    title="Completed projects"
                    value={dashboardData.totalNumberCompletedProjects}
                />


            </div>

            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="col-12 mb-2">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between" style={{ position: "relative" }}>
                                    <div className="d-flex flex-column">
                                        <div className="card-title mb-auto">
                                            <h5 className="mb-0">Roles Distribution</h5>
                                            <small>Daily Report</small>
                                        </div>
                                        <div className="chart-statistics">
                                            <h3 className="card-title mb-1">{Object.values(dashboardData.roleDistribution).length - 1} Roles</h3>
                                        </div>
                                    </div>
                                    <ReactApexChart
                                        options={{
                                            series: Object.values(dashboardData.roleDistribution),
                                            labels: Object.keys(dashboardData.roleDistribution),
                                            colors: ["#71dd37", "#ade583", "#c6f1af", "#a1f074"],
                                            stroke: { width: 0 },
                                            dataLabels: {
                                                enabled: !1,
                                                formatter: function (o: any, e) { return parseInt(o) + "%" }
                                            },
                                            legend: { show: false },
                                            grid: { padding: { top: -5, bottom: -13 } },
                                            plotOptions: {
                                                pie: {
                                                    donut: {
                                                        size: "75%",
                                                        labels: {
                                                            show: true,
                                                            value: {
                                                                fontSize: "1.5rem", fontFamily: "Public Sans",
                                                                color: "#566a7f", fontWeight: 500, offsetY: -15,
                                                                formatter: function (o) { return parseInt(o) + "%" }
                                                            },
                                                            name: { offsetY: 20, fontFamily: "Public Sans" },
                                                            total: {
                                                                show: true,
                                                                fontSize: ".7rem",
                                                                label: "Roles",
                                                                color: "#566a7f",
                                                                formatter: function (o) { return "100%" }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                        series={Object.values(dashboardData.roleDistribution)}
                                        type="donut"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div style={{ paddingRight: "0.5rem" }} className="col-6">
                            <div style={{ height: "160px" }} className="card">
                                <div style={{ padding: "10px 10px 0px 10px" }} className="card-body">
                                    <span className="d-block fw-semibold mb-2">Projects</span>
                                    <h3 className="card-title mb-2">{dashboardData.totalNumberProjects}</h3>
                                    {/* <span style={{opacity: 0}} className="badge bg-label-info mb-2">+34%</span> */}
                                    <small className="text-muted d-block">Completed</small>
                                    <div className="d-flex align-items-center">
                                        <div className="progress w-75 me-2" style={{ height: "8px" }}>
                                            <div className="progress-bar bg-info" style={{ width: `${progressPercentage}%` }} role="progressbar" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100}></div>
                                        </div>

                                        <span>{progressPercentage.toFixed(2)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ paddingLeft: 0 }} className="col-6">
                            <div style={{ height: "160px" }} className="card">
                                <div style={{ padding: "10px 10px 0px 10px" }} className="card-body pb-0">
                                    <span className="d-block fw-semibold">Users</span>
                                </div>
                                <ReactApexChart
                                    options={{
                                        chart: { sparkline: { enabled: !0 }, parentHeightOffset: 0 },
                                        colors: ["#696cff"],
                                        plotOptions: { radialBar: { startAngle: -90, endAngle: 90, hollow: { size: "65%" }, track: { background: "#f3f4f6" }, dataLabels: { name: { show: !1 }, value: { fontSize: "22px", color: "#566a7f", fontWeight: 500, offsetY: 0 } } } },
                                        grid: { show: !1, padding: { left: -10, right: -10 } },
                                        stroke: { lineCap: "round" }, labels: ["Progress"]
                                    }}
                                    series={[activeUsersPercentage]}
                                    type="radialBar"
                                />
                                <div className="p-3 pt-2">
                                    <small className="text-muted d-block text-center">Active</small>
                                </div>
                                <div className="resize-triggers"><div className="expand-trigger"><div style={{ width: "181px", height: "203px" }}></div></div><div className="contract-trigger"></div></div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="card mb-4 col-md-8">
                    <div id="chartRow" className='row'>
                        <div className="col-sm-12 col-md-9 col-lg-9">
                            <div className="row row-bordered g-0">
                                <div className="col-md-12">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">Projet Par company</h5>
                                        <small className="card-subtitle">Daily report</small>
                                    </div>

                                    <div className="card-body" style={{ position: "relative" }}>
                                        <div id="totalIncomeChart">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ borderLeft: "1px solid #d9dee3" }} className="col-sm-12 col-md-3">
                            <div className="card-header d-flex justify-content-between">
                                <div>
                                    <h5 className="card-title mb-0">Leaderboard</h5>
                                    <small className="card-subtitle">Monthly</small>
                                </div>

                            </div>
                            <div className="card-body">
                                <div className="report-list" style={{ marginLeft: "-7px" }}>

                                    {dashboardData.barchart
                                        .sort((a, b) => b.projectCount - a.projectCount)
                                        .slice(0, 3)
                                        .map((item, index) => <div key={index} className="report-list-item rounded-2 mb-3">
                                            <div className="d-flex align-items-start">
                                                <div className="report-list-icon shadow-sm me-1">
                                                    <ProfileAvatar
                                                        firstName={item.company}
                                                        radius={30}
                                                    />
                                                </div>
                                                <div className="d-flex justify-content-between align-items-end w-100 flex-wrap gap-2">
                                                    <div className="d-flex flex-column">
                                                        <h6 className="mb-0">{item.company}</h6>
                                                        <span style={{ fontSize: "0.7375rem" }}>Project :{item.projectCount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>)}


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="row">
                <div className="col-md-5 col-12">
                    <div className="row">
                        <div className="col-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <span>total existant tickets </span>
                                        <div className="avatar flex-shrink-0">
                                            <span className="badge bg-label-warning rounded p-2">
                                                <i className="bx bx-credit-card-front bx-sm"></i>

                                            </span>
                                        </div>

                                    </div>

                                    <h6 className="card-title mb-2">{dashboardData.totalNumberTickets}   </h6>

                                </div>
                            </div>
                        </div>
                        <div className="col-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <span> average Tickets Per Project</span>

                                        <div className="avatar flex-shrink-0">
                                            <span className="badge bg-label-primary rounded p-2">
                                                <i className="bx bx-credit-card-front bx-sm"></i>
                                            </span>
                                        </div>

                                    </div>

                                    <h6 className="card-title mb-2">{dashboardData.averageTicketsPerProject}   </h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <span>total Requested Ticket </span>
                                        <div className="avatar flex-shrink-0">
                                            <span className="badge bg-label-danger rounded p-2">
                                                <i className="bx bx-git-pull-request bx-sm"></i>
                                            </span>
                                        </div>

                                    </div>

                                    <h6 className="card-title mb-2">{dashboardData.totalNumberOpenTicket}   </h6>

                                </div>
                            </div>
                        </div>
                        <div className="col-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <span>total Closed Tickets</span>
                                        <div className="avatar flex-shrink-0">
                                            <span className="badge bg-label-success rounded p-2">
                                                <i className="bx bx-check-square bx-sm"></i>
                                            </span>
                                        </div>

                                    </div>

                                    <h6 className="card-title mb-2">{dashboardData.totalNumberClosedTicket}   </h6>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-7 col-12 mb-4">
                    <div className="card h-100">
                        <div className="card-header d-flex justify-content-between mb-3">
                            <div className="card-title mb-0">
                                <h5 className="m-0 me-2">Top 5 most members assigned to tickets</h5>
                                <small className="text-muted">Daily Overview</small>
                            </div>

                        </div>
                        <div className="card-body">
                            <ul className="p-0 m-0">
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <ProfileAvatar
                                            firstName="cyrine"
                                            lastName="bh"
                                            radius={40}
                                        />                                       </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                            <div className="d-flex align-items-center">
                                                <h6 className="mb-0 me-1"></h6>
                                                <small className="text-success fw-semibold">

                                                </small>
                                            </div>
                                            <small className="text-muted"> cyrine bh</small>
                                        </div>
                                        <div className="user-progress">
                                            <h6 className="mb-0">15 tickets</h6>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <ProfileAvatar
                                            firstName="sarra"
                                            lastName="bh"
                                            radius={40}
                                        />                                       </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">

                                            <small className="text-muted">sarra bh</small>
                                        </div>
                                        <div className="user-progress">
                                            <h6 className="mb-0">12 tickets </h6>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <ProfileAvatar
                                            firstName="lamia"
                                            lastName="bbh"
                                            radius={40}
                                        />                                       </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">

                                            <small className="text-muted">lamia bbh</small>
                                        </div>
                                        <div className="user-progress">
                                            <h6 className="mb-0">10 tickets </h6>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <ProfileAvatar
                                            firstName="nada"
                                            lastName="bhs"
                                            radius={40}
                                        />                                       </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">

                                            <small className="text-muted">nada bhs</small>
                                        </div>
                                        <div className="user-progress">
                                            <h6 className="mb-0">9 tickets </h6>
                                        </div>
                                    </div>
                                </li>
                                <li className="d-flex">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <ProfileAvatar
                                            firstName="dina"
                                            lastName="sbh"
                                            radius={40}
                                        />                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">

                                            <small className="text-muted">dina sbh</small>
                                        </div>
                                        <div className="user-progress">
                                            <h6 className="mb-0">8 tickets</h6>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DashboardForAdmin