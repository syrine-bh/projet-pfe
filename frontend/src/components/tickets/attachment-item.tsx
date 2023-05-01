import { apiClient, config } from '../../config'
import { AttachmentModel } from '../../models/AttachmentModel'

import '../../stylesheets/attachment.css'

interface AttachmentItemProps {
    attachment: AttachmentModel
}

function AttachmentItem({ attachment }: AttachmentItemProps) {

    const manageFileImage = (fileType: string) => {
        const type = fileType.split('/')[0]
        const subType = fileType.split('/')[1];

        if (type === "image") {
            return "./assets/img/attachements/image.png";
        }

        if (type === "application" && subType.includes("word")) {
            return "./assets/img/attachements/docx.png"
        }

        if (type === "application" && subType.includes("json")) {
            return "./assets/img/attachements/json.png"
        }

        if (type === "application" && subType.includes("zip")) {
            return "./assets/img/attachements/zip.png"
        }

        if (type === "application" && subType.includes("pdf")) {
            return "./assets/img/attachements/pdf.png"
        }

        if (type === "application" && subType.includes("excel")) {
            return "./assets/img/attachements/csv.png"
        }

        return "./assets/img/attachements/txt.png"
    }

    const handleDownload = async (attachmentName: string) => {
        const response = await apiClient.get(`/attachments/${attachmentName}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', attachmentName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className='attachment-container'>
            <img width={48} height={48} src={manageFileImage(attachment.mimeType)} alt="code" />
            <div className='text-container'>
                <p>{attachment.displayName}</p>
            </div>
            <small className="text-muted">
                {new Date(attachment.createdAt).toDateString()}
            </small>
            <small>
                {attachment.mimeType.split('/')[0]}
            </small>
            <div className='attachment-options'>
                <div>
                    <a target='_blank' href={`${config.baseUrl}/attachments/${attachment.name}`} className="btn rounded-pill btn-icon btn-label-secondary me-1">
                        <span className="tf-icons bx bx-expand"></span>
                    </a>
                </div>
            </div>
        </div>



    )
}

export default AttachmentItem