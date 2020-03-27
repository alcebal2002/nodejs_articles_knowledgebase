function Article (id,title,author,body) {
    // Set properties
    this.id = id;
    this.title = title;
    this.author = author;
    this.body = body;
    
    console.log(`'Created Article class: ${id}, ${title}'`);
}

Article.prototype.setId = function(id) {
    this.id = id;
};

Article.prototype.setTitle = function(id) {
    this.id = id;
};

Article.prototype.setAuthor = function(id) {
    this.id = id;
};

Article.prototype.setBody = function(body) {
    this.id = id;
};

module.exports = Article;