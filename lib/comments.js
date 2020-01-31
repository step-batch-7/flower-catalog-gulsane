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
    <td>${new Date(this.time).toLocaleString()}</td>
 </tr>
`;
  }
}

class Comments {
  constructor() {
    this.comments = [];
  }
  addComment(comment) {
    this.comments.unshift(comment);
  }
  toHTML() {
    return this.comments.map(comment => comment.toHTML()).join('');
  }
  toJSON() {
    return JSON.stringify(this.comments);
  }
  static load(previousComments) {
    const comments = new Comments();
    previousComments.forEach(comment => {
      comments.comments.push(
        new Comment(comment.name, comment.commentMsg, comment.time)
      );
    });
    return comments;
  }
}

module.exports = { Comment, Comments };
