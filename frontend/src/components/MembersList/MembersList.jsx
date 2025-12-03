import React from 'react';
import './MembersList.css';

export default function MembersList({ members }) {
  return (
    <div className="members-panel">
      {members.length === 0 ? (
        <div>No members</div>
      ) : (
        members.map((m) => (
          <div key={m._id} className="member-row" onClick={() => onMemberClick && onMemberClick(m)}>
            {m.displayName || m.email}
          </div>
        ))
      )}
    </div>
  );
}
