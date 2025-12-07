import React from 'react';
import './MembersList.css';
import '../Shared/Modal.css';
import emailIcon from "../../../assets/emailIcon.svg";
export default function MembersList({ members }) {
  return (
    <div className="members-panel">
      {members.length === 0 ? (
        <div className='members-message'>No members</div>
      ) : (
        members.map((m) => (
          <div key={m._id} className="member-col" onClick={() => onMemberClick && onMemberClick(m)}>
            <p className='name'>{`${m.firstName} ${m.lastName}`} </p>
            <p className='email'>{m.email}</p>
            <a href={`mailto:${m.email}`} target='_blank' className="btn primary">
              Send Email <img className='email-icon' src={emailIcon} alt="email icon" />
            </a>
          </div>
        ))
      )}
    </div>
  );
}
