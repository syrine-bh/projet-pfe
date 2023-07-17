import React from 'react'

interface LargeCardProps {
    icon: JSX.Element
    title: string
    value: number
}

function LargeCard({ icon, title, value }: LargeCardProps) {
    return (
        <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <div className="card-info">
                            <p className="card-text">{title}</p>
                            <div className="d-flex align-items-end mb-2">
                                <h4 className="card-title mb-0 me-2">{value}</h4>
                                <small className="text-success"></small>
                            </div>
                            <small>Daily report</small>
                        </div>
                        <div className="card-icon">
                            {icon}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LargeCard