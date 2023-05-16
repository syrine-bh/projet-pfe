import ProfileAvatar from '../profile-avatar';
import { CommentModel } from '../../models/CommentModel';
import { useState } from 'react';

import '../../stylesheets/comment-script.css'
import '../../stylesheets/comment-commit.css'
import { TicketModel } from '../../models/TicketModel';

interface CommentitemProps {
    comment: CommentModel;
    ticket: TicketModel
}




function CommentItem({ comment, ticket }: CommentitemProps) {
    let formattedComment = comment.content;

    let commentWithoutParagraph = comment.content.replaceAll('<p>', '').replaceAll('</p>', '')
    let commentLines = commentWithoutParagraph.split('<br>')
    formattedComment = commentWithoutParagraph.replaceAll('<br>', '\n')
    //let newCommentContent = comment.content;

    /*if (comment.type=== "script") {
        formattedComment = `script SQL :$${comment.content}`;
    } else if (comment.type === "commit") {
        formattedComment = `commit: ${comment.content}`;
    }*/

    { /* const downloadComment = (comment: CommentModel) => {
        const element = document.createElement("a");
        const file = new Blob([comment.content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "comment.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }*/}

    const downloadComment = () => {
        let filename = 'comment.txt';

        if (comment.type.toUpperCase() === "SCRIPT") {
            filename = 'script.sql';
            const file = new Blob([formattedComment], { type: 'text/plain' });
            const element = document.createElement('a');
            element.href = URL.createObjectURL(file);
            element.download = filename;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        } else {
            const file = new Blob([comment.content], { type: 'text/plain' });
            const element = document.createElement('a');
            element.href = URL.createObjectURL(file);
            element.download = filename;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    };





    const [copied, setCopied] = useState(-1);

    const [copiedSHA, setCopiedSHA] = useState(-1);



    function handleCopy(item: string, index: number) {
        navigator.clipboard.writeText(item);
        setCopied(index);
        setTimeout(() => setCopied(-1), 3000);
    }

    const handleCopySHA = (comment: CommentModel) => {
        navigator.clipboard.writeText(comment.content.replace(/<\/?p>/g, ''));
        setCopiedSHA(comment.id);
        setTimeout(() => setCopiedSHA(-1), 3000);
    }


    return (
        <div className="media mb-4 d-flex align-items-start">
            <div className="avatar avatar-sm me-2 flex-shrink-0 mt-1">
                <ProfileAvatar
                    firstName={comment.addedBy.firstname}
                    lastName={comment.addedBy.lastname}
                    radius={28}
                />
            </div>
            <div style={{ width: "100%" }} className="media-body">
                <div className="d-flex align-items-center justify-content-between">
                    <div style={{ width: "100%", paddingInline: "5px" }}>
                        <span className="fw-semibold">{comment.addedBy.firstname} {comment.addedBy.lastname}</span>
                        <br />
                        {comment.type === "script" ? (
                            <div className='code'>
                                {commentLines.map((item, index) => (
                                    <div className='line'>
                                        <p key={index}>{item}</p>
                                        <button type="button" className="btn btn-icon btn-label-primary" onClick={() => handleCopy(item, index)}>
                                            {copied === index ? 'Copied!' : <span className="tf-icons bx bx-copy"></span>}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )
                            : comment.type === "commit"
                                ?
                                <div className='d-flex'>
                                    <div className='commit-container commit-border'>
                                        <div className='copy-sha' onClick={() => handleCopySHA(comment)}>
                                            {copiedSHA === comment.id
                                                ? <i className='bx bx-check' ></i>
                                                : <i className='bx bx-copy'></i>}
                                        </div>
                                        <a target="_blank" href={`${ticket.project.gitRepo}/commit/${comment.content.replace(/<\/?p>/g, '')}`} className='open-link'>
                                            {comment.content.replace(/<\/?p>/g, '').substring(0, 7)}
                                        </a>
                                    </div>
                                    <a target="_blank" href={`${ticket.project.gitRepo}/tree/${comment.content.replace(/<\/?p>/g, '')}`} className='browse-code'>
                                        <i className='bx bx-code'></i>
                                    </a>
                                </div>






                                : <span className="text comment-text" dangerouslySetInnerHTML={{ __html: comment.content }}></span>
                        }

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <small className="text-muted">{new Date(comment.createdAt).toLocaleDateString()}</small>
                            {comment.type === "script" && (
                                <button type="button" className="btn btn-icon btn-label-primary me-2" onClick={downloadComment}>
                                    <span className="tf-icons bx bx-download"></span>
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>



    )
}

export default CommentItem;
