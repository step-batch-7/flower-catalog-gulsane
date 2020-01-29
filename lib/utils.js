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

const decodeValue = value => {
  let decodedValue = value.replace(/\+/g, " ");
  return decodeURIComponent(decodedValue);
};

const pickupParams = (query, keyValue) => {
  const [key, value] = keyValue.split("=");
  query[key] = decodeValue(value);
  return query;
};

const readParams = keyValueTextPairs =>
  keyValueTextPairs.split("&").reduce(pickupParams, {});

module.exports = { createTable, readParams };
