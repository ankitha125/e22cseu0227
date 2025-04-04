const fetch = require('node-fetch');

const API_URL = 'http://20.244.56.144/evaluation-service';

let savedData = {
    users: null,
    lastUsersFetch: null,
    userPosts: {},
    postComments: {}
};

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error fetching data:', error);
        throw error;
    }
}

async function getUsers() {
    if (savedData.users && savedData.lastUsersFetch && 
        Date.now() - savedData.lastUsersFetch < 30000) {
        return savedData.users;
    }
    const data = await fetchData(`${API_URL}/users`);
    savedData.users = data;
    savedData.lastUsersFetch = Date.now();
    return data;
}

async function getUserPosts(userId) {
    if (savedData.userPosts[userId] && 
        savedData.userPosts[userId].timestamp && 
        Date.now() - savedData.userPosts[userId].timestamp < 30000) {
        return savedData.userPosts[userId].data;
    }
    const data = await fetchData(`${API_URL}/users/${userId}/posts`);
    savedData.userPosts[userId] = {
        data: data,
        timestamp: Date.now()
    };
    return data;
}

async function getPostComments(postId) {
    if (savedData.postComments[postId] && 
        savedData.postComments[postId].timestamp && 
        Date.now() - savedData.postComments[postId].timestamp < 30000) {
        return savedData.postComments[postId].data;
    }
    const data = await fetchData(`${API_URL}/posts/${postId}/comments`);
    savedData.postComments[postId] = {
        data: data,
        timestamp: Date.now()
    };
    return data;
}

async function getTopUsers() {
    try {
        const usersData = await getUsers();
        let userPostCounts = [];
        for (const userId in usersData.users) {
            const postsData = await getUserPosts(userId);
            userPostCounts.push({
                userId: userId,
                name: usersData.users[userId],
                postCount: postsData.posts.length
            });
        }
        userPostCounts.sort((a, b) => b.postCount - a.postCount);
        return {
            topUsers: userPostCounts.slice(0, 5)
        };
    } catch (error) {
        console.log('Error in getTopUsers:', error);
        throw error;
    }
}

async function getPosts(type) {
    try {
        const usersData = await getUsers();
        let allPosts = [];
        for (const userId in usersData.users) {
            const postsData = await getUserPosts(userId);
            for (const post of postsData.posts) {
                allPosts.push({
                    ...post,
                    userName: usersData.users[userId]
                });
            }
        }
        if (type === 'latest') {
            allPosts.sort((a, b) => b.id - a.id);
            return {
                latestPosts: allPosts.slice(0, 5)
            };
        } else if (type === 'popular') {
            for (const post of allPosts) {
                const commentsData = await getPostComments(post.id);
                post.commentCount = commentsData.comments.length;
            }
            allPosts.sort((a, b) => b.commentCount - a.commentCount);
            const highestCommentCount = allPosts[0].commentCount;
            const mostCommentedPosts = allPosts.filter(
                post => post.commentCount === highestCommentCount
            );
            return {
                popularPosts: mostCommentedPosts
            };
        }
    } catch (error) {
        console.log('Error in getPosts:', error);
        throw error;
    }
}

module.exports = {
    getTopUsers,
    getPosts
};
