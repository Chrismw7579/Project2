/* eslint-disable no-undef */
// THIS GETS THE LIST OF USERS FROM THE SERVER AND THEN APPENDS THEM TO THE SCREEN
// THIS WILL ALSO NEED TO POPULATE THE CLIENTS PAST CONVERSATIONS
const usersContainer = document.getElementById('users-container');
const currentUser = document.getElementById('myid');
const currentUserId = currentUser.getAttribute('value');

$.ajax({
	url: '/api/users',
	type: 'GET',
	success: function (data) {
		data.forEach(user => {
			if(currentUserId != user.id) {
				appendUser(user);
			}
		});
	}
});

function appendUser(data) {
	let newUser = document.createElement('div');

	let name = document.createElement('h1');
	name.textContent = data.email;

	let button = document.createElement('button');
	button.setAttribute('value', data.id);
	button.textContent = 'Connect';

	button.addEventListener('click', function (e) {
		e.preventDefault();
		fetch(`/api/find-room/${currentUserId}/${button.value}`)
			.then(response => response.json())
			.then((data) => {
				window.location.href = `/members/chatrooms/room/${data.id}`;
			});
	});

	newUser.appendChild(button);
	newUser.appendChild(name);
	usersContainer.append(newUser);
}