function find(array, name) {
    for (var entry of array) {
        if (entry.name === name) {
            return entry;
        }
        if (Array.isArray(entry.children)) {
            var found = find(entry.children, name);
            if (found) {
                return found;
            }
        }
    }
    return 0
}

function update_tree(array) {
    for (var index = 0; index < array.length; index++) {
        var entry = array[index]
        if (entry.title && entry.title.search("/博士生|硕士生|本科生|导师/")) {
            var t = find(array, entry.title)
            if (t) {
                var temp = {
                    name: entry.name,
                    children: entry.children,
                    msg: entry.msg
                }
                array.splice(index, 1)
                index--
                t.children.push(temp)
            } else {
                var temp = {
                    name: entry.name,
                    children: entry.children,
                    msg: entry.msg
                }
                entry.name = entry.title
                delete entry.title
                delete entry.msg
                entry.children = [temp]
            }
        }
        if (Array.isArray(entry.children)) {
            update_tree(entry.children)
        }

    }
}

function up_father(array, fa, depth) {
    for (var entry of array) {
        entry.parent = fa
        if (Array.isArray(entry.children)) {
            up_father(entry.children, entry.name, depth + 1)
        }
        if (depth == 3) child_node++
    }
}

function get_json(msg) {
    var key_word = ["导师", "级博士生", "级硕士生", "级本科生"]
    var strs = msg.split("\n")
    child_node = 0
    var i = 0
    var [title, name] = strs[i].split("：")
    var T_id = i
    var Person = [{
        title: title,
        name: name,
        parent: "null",
        children: [],
        msg: []
    }]
    var num = 0
    i = 1
    for (; i < strs.length; i++) {
        if (strs[i] == '') break
        var [title, names] = strs[i].split("：")
        var name = names.split("、")
        for (var j = 0; j < name.length; j++) {
            var temp = {
                title: title,
                name: name[j].trim(),
                children: [],
                msg: []
            }
            Person[T_id].children.push(temp)
        }
    }
    // json = JSON.stringify(Person)
    // console.log(JSON.stringify(Person))
    i++
    for (; i < strs.length; i++) {
        if (strs[i] == '') continue
        var [name, skills] = strs[i].split("：")
        skill = skills.split("、")
        find(Person, name).msg = skill
    }
    update_tree(Person)
    up_father(Person, "null", 0)
    json = JSON.stringify(Person)
    console.log(JSON.stringify(Person))
    All_child_node += child_node
    return json
}