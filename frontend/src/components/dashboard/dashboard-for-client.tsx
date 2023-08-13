import React from 'react'

function DashboardForClient() {
  return (
    <div className="container-xxl flex-grow-1 container-p-y">
            <iframe 
    title="clientDash1" 
    width="100%" 
    height="100%" 
    src="https://app.powerbi.com/reportEmbed?reportId=b8b17514-4587-47e9-af9d-33ceac20ad3b&autoAuth=true&ctid=513486ec-6643-4f17-a508-76478311be42"    frameBorder={0} 
    allowFullScreen={true}>
    </iframe>
        </div>

  )
}

export default DashboardForClient


