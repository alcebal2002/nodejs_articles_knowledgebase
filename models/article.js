function Article (id,title,author,body) {
    // Set properties
    this.id = id;
    this.title = title;
    this.author = author;
    this.body = body;
    
    // console.log(`'Created Article class: ${id}, ${title}'`);
}

module.exports = Article;