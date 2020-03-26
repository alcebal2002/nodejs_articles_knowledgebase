function Article() {
    var id;
    var title;
    var author;
    var body;

    function setId(newId) {
       if (!newId) 
          throw new Error('Cannot set empty id');
       id = newId;
    }
    function getId() {
       return id;
    }
    function setTitle(newTitle) { 
        title = newTitle; 
    }
    function getTitle() { 
        return title; 
    }
    function setAuthor(newAuthor) { 
        author = newAuthor; 
    }
    function getAuthor() { 
        return author; 
    }
    function setBody(newBody) { 
        body = newBody; 
    }
    function getBody() { 
        return body; 
    }
 } 