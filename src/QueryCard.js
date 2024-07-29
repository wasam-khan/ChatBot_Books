import React from 'react';

const QueryCard = ({ query, onClick }) => {
  return (
    <div className="query-card" onClick={() => onClick(query)}>
      {query}
    </div>
  );
};

export default QueryCard;
