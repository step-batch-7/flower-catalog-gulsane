const Response = require("./response.js");

const getResponseObject = function(content, contentType) {
  const res = new Response();
  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Length", content.length);
  res.statusCode = 200;
  res.body = content;
  return res;
};

const formatComment = function(comment) {
  const formattedComment = {};
  formattedComment.guestName = comment.guestName.replace(/\+/g, " ");
  formattedComment.commentMsg = comment.commentMsg.replace(/\+/g, " ");
  return formattedComment;
};

const createTable = function(comments) {
  let tableHTML = "";
  comments.forEach(comment => {
    tableHTML += "<tr>";
    tableHTML += `<td> ${comment.date} </td>`;
    tableHTML += `<td> ${comment.guestName} </td>`;
    tableHTML += `<td> ${comment.commentMsg} </td>`;
    tableHTML += "</tr>";
  });
  return tableHTML;
};

module.exports = { getResponseObject, formatComment, createTable };
