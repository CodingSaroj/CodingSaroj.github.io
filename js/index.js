var pageEnv = {
    pg: "home",
    blg: "",
    prj: ""
}

function searchCustom(str1, str2)
{
    return str1.toLowerCase().indexOf(str2.toLowerCase()) != -1
}

function markedWrapper(text){
    try
    {
        return marked(text)
    }
    catch (error)
    {
        return text
    }
}

function onWindowLoad()
{
    if (window.location.search.length == 0)
    {
        window.location.search = '?pg=home'
    }
    
    var searchVarsStr = window.location.search.substr(1)

    var searchVars = searchVarsStr.split('&')

    for (var i = 0; i < searchVars.length; i++)
    {
        searchVars[i] = searchVars[i].split('=')

        pageEnv[searchVars[i][0]] = searchVars[i][1]
    }

    document.getElementById('page-content').setAttribute('include-html', pageEnv.pg + '.html')
}

function setTitle()
{
    var title

    var currPage = document.getElementById('page-content').getAttribute('include-html')

    if (currPage == 'home.html')
    {
        title = 'Home - Coding Saroj'
    }
    else if (currPage == 'blog.html')
    {
        var blogTitle = document.getElementById('blog-title').textContent

        title = blogTitle.length != 0 ? blogTitle + ' - Blog - Coding Saroj' : 'Blog - Coding Saroj'
    }
    else if (currPage == 'about.html')
    {
        title = 'About - Coding Saroj'
    }
    else if (currPage == 'projects.html')
    {
        var projectTitle = document.getElementById('project-title').textContent

        title = projectTitle.length != 0 ? projectTitle + ' - Projects - Coding Saroj' : 'Projects - Coding Saroj'
    }
    
    document.getElementsByTagName('title')[0].innerHTML = title
}

function includePageContent()
{
    var elem = document.getElementById('page-content')
    var currPage = elem.getAttribute('include-html')

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function()
    {
        if (this.readyState == 4)
        {
            if (this.status == 200)
            {
                elem.innerHTML = this.responseText;
            }

            if (this.status == 404)
            {
                elem.style.display = 'flex'
                elem.style.fontSize = '40px'
                elem.style.marginTop = '20%'
                elem.style.justifyContent = 'center'
                elem.style.alignItems = 'center'
                elem.innerHTML = '404 Page "' + currPage.substr(0, currPage.length - 5) + '" not found!'
            }
        }
    }

    xhttp.open("GET", currPage, true)
    xhttp.send()
    
    setTitle()

    document.getElementById('post-list').innerHTML = ''
    document.getElementById('project-list').innerHTML = ''
    document.getElementById('blog-search-container').style.display = 'none'
    document.getElementById('project-search-container').style.display = 'none'

    document.getElementById('blog-title').innerHTML = ''
    document.getElementById('blog-content').innerHTML = ''
    document.getElementById('blog-footer').innerHTML = ''

    document.getElementById('project-title').innerHTML = ''
    document.getElementById('project-info').innerHTML = ''
    document.getElementById('project-description').innerHTML = ''

    if (currPage == 'blog.html')
    {
        if (pageEnv.blg.length > 0)
        {
            gotoBlog('../xml/blog/' + pageEnv.blg + '.xml')
        }
        else
        {
            listBlogPosts()
        }
    }
    else if (currPage == 'projects.html')
    {
        if (pageEnv.prj.length > 0)
        {
            gotoProject('../xml/projects/' + pageEnv.prj + '.xml')
        }
        else
        {
            listProjects()
        }
    }
}

function setPageContent(currPage)
{
    window.location.search = '?pg=' + currPage.substr(0, currPage.length - 5)
}

function gotoBlog(file)
{
    if (document.getElementById('page-content').getAttribute('include-html') != 'blog.html')
    {
        return
    }

    var xhttp = new XMLHttpRequest()
    
    xhttp.open('GET', file, false)
    xhttp.send()

    var xmlDoc = xhttp.responseXML

    var root = xmlDoc.getRootNode()

    var title = root.childNodes[0].childNodes[1].textContent
    var body = root.childNodes[0].childNodes[3].textContent
    var footer = root.childNodes[0].childNodes[5].textContent

    document.getElementById('blog-title').innerHTML = markedWrapper(title)
    document.getElementById('blog-content').innerHTML = markedWrapper(body)
    document.getElementById('blog-footer').innerHTML = markedWrapper(footer)

    setTitle()
}

function gotoProject(file)
{
    if (document.getElementById('page-content').getAttribute('include-html') != 'projects.html')
    {
        return
    }

    var xhttp = new XMLHttpRequest()
    
    xhttp.open('GET', file, false)
    xhttp.send()

    var xmlDoc = xhttp.responseXML

    var root = xmlDoc.getRootNode()

    var title = root.childNodes[0].attributes['title'].nodeValue
    var language = root.childNodes[0].attributes['language'].nodeValue
    var languageVersion = root.childNodes[0].attributes['languageVersion'].nodeValue
    var type = root.childNodes[0].attributes['type'].nodeValue
    var stableVersion = root.childNodes[0].attributes['stableVersion'].nodeValue
    var develVersion = root.childNodes[0].attributes['develVersion'].nodeValue
    var firstReleaseDate = root.childNodes[0].attributes['firstReleaseDate'].nodeValue
    var latestReleaseDate = root.childNodes[0].attributes['latestReleaseDate'].nodeValue

    var tagsStr = root.childNodes[0].childNodes[1].attributes['list'].nodeValue
    var tags = tagsStr.split(';')

    var repoLink = root.childNodes[0].childNodes[3].attributes['link'].nodeValue

    document.getElementById('project-title').innerHTML = title

    document.getElementById('project-tags').innerHTML = '<b style="margin-top: 5px">Tags:</b>'

    for (var i = 0; i < tags.length; i++)
    {
        document.getElementById('project-tags').innerHTML += '\
            <div style="height: min-content; font-size: 14px; background-color: #00000044; padding: 5px 5px; margin: 5px 5px; border-radius: 5px;">\
                ' + tags[i] + '\
            </div>'
    }

    document.getElementById('project-info').innerHTML = '\
        <ul style="display: flex; list-style: none;">\
            <div>\
                <li><b>Language</b>: ' + language + ' ' + languageVersion + '</li>\
                <li><b>Type</b>: ' + type + '</li>\
                <li><b>First release date</b>: ' + firstReleaseDate + '</li>\
            </div>\
            <div style="padding-left: 30px">\
                <li><b>Stable version</b>: ' + stableVersion + '</li>\
                <li><b>Development version</b>: ' + develVersion + '</li>\
                <li><b>Latest release date</b>: ' + latestReleaseDate + '</li>\
            </div>\
        </ul>\
        <b>Repository link</b>: <a href="' + repoLink + '">' + repoLink + '</a>'

    setTitle()

    var description
    
    try
    {
        xhttp.open('GET', 'https://raw.githubusercontent.com/SarojKumar10/PeregrineCPPLogger/master/README.md', false)
        xhttp.send()
        
        description = xhttp.responseText
    }
    catch(error)
    {
        description = 'Could not retrieve project description from <a href="https://raw.githubusercontent.com/SarojKumar10/PeregrineCPPLogger/master/README.md">https://raw.githubusercontent.com/SarojKumar10/PeregrineCPPLogger/master/README.md</a>.'
    }

    document.getElementById('project-description').innerHTML = '\
        <div style="word-wrap: break-word">\
            ' + markedWrapper(description) + '\
        </div>'
}

function preparePostElem(postName, postDate)
{
    return '\
    <li style="list-style: none; background-color: #00000088; display: flex;">\n\
       <div onclick="window.location.search += \'&blg=' + postName + '\'; document.getElementById(\'post-list\').innerHTML = \'\';" style="display: flex; width: 100%; cursor: pointer;">\n\
           <div style="width: 50%; padding: 10px; text-align: left;">' + postName + '</div>\n\
           <div style="width: 50%; padding: 10px; text-align: right;"><i>Posted on '+ postDate + '</i></div>\n\
       </div>\n\
    </li>'
}

function searchBlogPosts()
{
    var passingPosts = []
    
    var unchangedQuery = document.getElementById('blog-search').value
    var query = unchangedQuery.toLowerCase()

    var xhttp = new XMLHttpRequest()
    
    xhttp.open('GET', '../blogposts.txt', false)
    xhttp.send()

    var postsStr = xhttp.responseText

    var posts = postsStr.split('\n')

    for (var i = 0; i < posts.length; i++)
    {
        posts[i] = posts[i].split(' ')
    }

    for (var i = 0; i < posts.length; i++)
    {
        while (posts[i][0].search('\\%\\$') != -1)
        {
            posts[i][0] = posts[i][0].replace('%$', ' ')
        }

        if (searchCustom(posts[i][0], query))
        {
            passingPosts.push(posts[i])
        }
    }

    var elem = document.getElementById('post-list')

    elem.innerHTML = ''

    document.getElementById('blog-search-container').style.display = 'flex'

    for (var i = 0; i < passingPosts.length; i++)
    {
        passingPosts[i][0] = passingPosts[i][0].substr(0, passingPosts[i][0].length - 4)

        elem.innerHTML += preparePostElem(passingPosts[i][0], passingPosts[i][1])
    }

    document.getElementById('blog-search').value = unchangedQuery
    document.getElementById('blog-search').focus()
}

function prepareProjectElem(postName, tags)
{
    var tagsHTML = ''

    for (var i = 0; i < tags.length; i++)
    {
        tagsHTML += '\
            <div style="height: min-content; font-size: 12px; background-color: #00000044; padding: 0px 5px; margin: 0px 5px 5px 5px; border-radius: 5px;">\
                ' + tags[i] + '\
            </div>'
    }

    return '\
        <li style="list-style: none; background-color: #00000088;">\n\
            <div onclick="window.location.search += \'&prj=' + postName + '\'; document.getElementById(\'project-list\').innerHTML = \'\';" style="display: flex; width: 100%; cursor: pointer;">\n\
                <div style="padding: 10px">' + postName + '</div>\
            </div>\
            <div style="display: flex; flex-wrap: wrap">\
                ' + tagsHTML + '\
            </div>\
        </li>'
}

function searchProjects()
{
    var passingProjects = []
    
    var unchangedQuery = document.getElementById('project-search').value
    var query = unchangedQuery.toLowerCase()

    var xhttp = new XMLHttpRequest()
    
    xhttp.open('GET', '../projects.txt', false)
    xhttp.send()

    var projectsStr = xhttp.responseText

    var projects = projectsStr.split('\n')

    var projectTags = []

    for (var i = 0; i < projects.length; i++)
    {
        while (projects[i].search('\\%\\$') != -1)
        {
            projects[i] = projects[i].replace('%$', ' ')
        }

        xhttp.open('GET', '../xml/projects/' + projects[i], false)
        xhttp.send()

        var tagsStr = xhttp.responseXML.getRootNode().childNodes[0].childNodes[1].attributes['list'].nodeValue

        projectTags.push(tagsStr.split(';'))
    }

    for (var i = 0; i < projects.length; i++)
    {
        var resultName = searchCustom(projects[i], query)

        var resultTags = false

        for (var j = 0; j < projectTags[i].length; j++)
        {
            resultTags |= searchCustom(projectTags[i][j], query)
        }

        if (resultName | resultTags)
        {
            passingProjects.push([projects[i], projectTags[i]])
        }
    }

    document.getElementById('project-search-container').style.display = 'flex'

    var elem = document.getElementById('project-list')

    elem.innerHTML = ''

    for (var i = 0; i < passingProjects.length; i++)
    {
        var project = passingProjects[i][0]
        var projectTags = passingProjects[i][1]

        project = project.substr(0, project.length - 4)

        elem.innerHTML += prepareProjectElem(project, projectTags)
    }

    document.getElementById('project-search').value = unchangedQuery
    document.getElementById('project-search').focus()
}

function listBlogPosts()
{
    var http = new XMLHttpRequest()
    
    http.open('GET', '../blogposts.txt', false)
    http.send()

    var postsStr = http.responseText

    // Remove trailing newlines
    while (projectsStr[projectsStr.length - 1] == '\n')
    {
        projectsStr = projectsStr.substr(0, projectsStr.length - 1)
    }

    var posts = postsStr.split('\n')

    if (postsStr == '')
    {
        posts = []
    }

    for (var i = 0; i < posts.length; i++)
    {
        posts[i] = posts[i].split(' ')
    }

    var elem = document.getElementById('post-list')

    elem.innerHTML = ''

    document.getElementById('blog-search-container').style.display = 'flex'

    for (var i = 0; i < posts.length; i++)
    {
        while (posts[i][0].search('\\%\\$') != -1)
        {
            posts[i][0] = posts[i][0].replace('%$', ' ')
        }

        posts[i][0] = posts[i][0].substr(0, posts[i][0].length - 4)

        elem.innerHTML += preparePostElem(posts[i][0], posts[i][1])
    }
}

function listProjects()
{
    var xhttp = new XMLHttpRequest()
    
    xhttp.open('GET', '../projects.txt', false)
    xhttp.send()

    var projectsStr = xhttp.responseText

    // Remove trailing newlines
    while (projectsStr[projectsStr.length - 1] == '\n')
    {
        projectsStr = projectsStr.substr(0, projectsStr.length - 1)
    }

    var projects = projectsStr.split('\n')

    if (projectsStr == '')
    {
        projects = []
    }

    var projectTags = []

    for (var i = 0; i < projects.length; i++)
    {
        while (projects[i].search('\\%\\$') != -1)
        {
            projects[i] = projects[i].replace('%$', ' ')
        }

        xhttp.open('GET', '../xml/projects/' + projects[i], false)
        xhttp.send()

        var tagsStr = xhttp.responseXML.getRootNode().childNodes[0].childNodes[1].attributes['list'].nodeValue

        projectTags.push(tagsStr.split(';'))
    }

    document.getElementById('project-search-container').style.display = 'flex'

    var elem = document.getElementById('project-list')

    elem.innerHTML = ''

    for (var i = 0; i < projects.length; i++)
    {
        projects[i] = projects[i].substr(0, projects[i].length - 4)

        elem.innerHTML += prepareProjectElem(projects[i], projectTags[i])
    }
}
