const excursion = () => {
	let timesList = document.querySelectorAll('.timesList .excursion-features-item__list');

	timesList.forEach((list) => {
		let wrapperHeight = list.offsetHeight;
	
		if(wrapperHeight > 57) {
			let timesItems = list.querySelectorAll('.timesList .time-badge');
			let lastVisibleLink;

			for(let item of timesItems) {
				if (item.offsetTop >= 54) {
						lastVisibleLink = item;
						break;
				}
			}

			let btnMore = document.createElement('a');
			btnMore.classList.add('time-badge');
			btnMore.innerText = 'ещё...';

			btnMore.addEventListener('click', () => {
				btnMore.style.display = 'none';
				list.parentNode.classList.add('timesList--show');
			});

			lastVisibleLink.previousElementSibling.before(btnMore);
		}
	});	
};

export default excursion;