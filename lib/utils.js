const createTable = function(comments) {
  let tableHTML = '';
  comments.forEach(comment => {
    tableHTML += '<tr>';
    tableHTML += `<td> ${comment.date} </td>`;
    tableHTML += `<td> ${comment.guestName} </td>`;
    tableHTML += `<td> ${comment.commentMsg} </td>`;
    tableHTML += '</tr>';
  });
  return tableHTML;
};

module.exports = { createTable };
