class Comment {
  constructor(name, commentMsg, time) {
    this.name = name;
    this.commentMsg = commentMsg;
    this.time = time;
  }
  toHTML() {
    return `<tr>
    <td>${this.name}</td>
    <td>${this.commentMsg}</td>
    <td>${this.time.toLocaleString()}</td>
 </tr>
`;
  }
}

module.exports = { Comment };
