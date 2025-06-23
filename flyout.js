
document.addEventListener('DOMContentLoaded', function () {
    const menuItems = document.querySelectorAll('li');

    menuItems.forEach(item => {
        const submenu = item.querySelector('.sub');
        if (!submenu) return; // Skip if no submenu exists

        let timeout;

        item.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
            submenu.classList.add('visible');
        });

        item.addEventListener('mouseleave', () => {
            timeout = setTimeout(() => {
                submenu.classList.remove('visible');
            }, 1000); // 1 seconds delay
        });
    });
    
    // Select all anchor tags whose href attribute contains 'good-health'
	const goodHealthMenuItems = document.querySelectorAll('a[href*="good-health"]');

	if(screen.width >= 900) {
		goodHealthMenuItems[0].addEventListener("mouseover", hoverPositioning);
	}

	// Iterate over each found menu item
	if (goodHealthMenuItems.length > 0) {
		goodHealthMenuItems.forEach(menuItem => {
		// Add a click event listener to each menu item
		if(screen.width < 900) {
			menuItem.addEventListener('click', function(event) {
			// Prevent the default link behavior (e.g., navigating to a new page)
			// if you intend to only show a submenu and not navigate immediately.
			// If you want the link to navigate AND show the submenu, you can remove this line.
			event.preventDefault();

			// Add the 'submenu-show' class to the clicked menu item
			this.parentElement.classList.add('submenu-show');
			if(!this.parentElement.lastElementChild.classList.contains('visible'))
				this.parentElement.lastElementChild.classList.add('visible');
			else
				this.parentElement.lastElementChild.classList.remove('visible');
			positionFlyingSubmenu();
			});
		}
	});
	}
});

function getDistanceFromElementToViewportBottom(element) {
    // 1. Get the element's position and dimensions relative to the viewport
    const rect = element.getBoundingClientRect();

    // 2. Get the height of the viewport
    // window.innerHeight is generally the most reliable for the visual viewport height
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    // 3. The distance from the top of the element to the bottom of the viewport
    // is simply the viewportHeight minus the element's 'top' position in the viewport.
    return viewportHeight - rect.top;
}

window.onscroll = function() { positionFlyingSubmenu()};

function positionFlyingSubmenu() {
	const goodHealthMenuItem = document.querySelectorAll('a[href*="good-health"]')[0];
	const goodHealthMenuItems = document.querySelectorAll('a[href*="good-health"] + ul')[0];
	
	
	if(!goodHealthMenuItems.classList.contains("positioned") && (getDistanceFromElementToViewportBottom(goodHealthMenuItems) < goodHealthMenuItems.offsetHeight || getDistanceFromElementToViewportBottom(goodHealthMenuItem) < goodHealthMenuItems.offsetHeight)) {
		goodHealthMenuItems.classList.add("positioned");
	}
	if(goodHealthMenuItems.classList.contains("positioned") && getDistanceFromElementToViewportBottom(goodHealthMenuItem) >= goodHealthMenuItems.offsetHeight)
	{
  		goodHealthMenuItems.classList.remove("positioned");
  	}
}

function hoverPositioning() {
	const goodHealthMenuItem = document.querySelectorAll('a[href*="good-health"]')[0];
	
	if(!goodHealthMenuItem.classList.contains("submenu-show"))
		positionFlyingSubmenu();
}
