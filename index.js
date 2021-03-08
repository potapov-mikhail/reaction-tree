
function createReactionNode(schema) {
    return {
        name: schema.name,
        children: schema.children || {},
        subscribers: [],
    }
}


function createReactionTree(schema) {

    return Object.keys(schema).reduce((tree, name) => {

        tree[name] = createReactionNode({
            name,
            children: Object.keys(schema[name]).length ? createReactionTree(schema[name]) : schema[name]
        });

        return tree;

    }, {});

}


function createReaction(path = [], cb) {
    return ctx => {
        let node = ctx;
        path.forEach(p => {
            node = node.children ? node.children[p] : node[p];
        });
        node.subscribers.push(cb);
        return () => node.subscribers.filter(f => f !== cb);
    }
}


function run(path) {
    return ctx => {
        let node = ctx;
        path.forEach(p => {
            node = node.children ? node.children[p] : node[p];
        });
        node.subscribers.forEach(f => f(1))
    }
}



const tree = createReactionTree({
    users: {
        admins: {}
    },
    phones: {
        mobiles: {
            iphones: {}
        }
    }
})


createReaction(['users', "admins"], console.log)(tree);
run(['users', "admins"])(tree)


























