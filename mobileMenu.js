
let isMenuOpen = false;
document.querySelector(".mobile-menu").addEventListener("click",()=>{
    if(!isMenuOpen){
        if(document.querySelector(".mobile-menu .burger").classList.contains("active")){
            document.querySelector(".mobile-menu .burger").classList.remove("active");
        }
        if(!document.querySelector(".mobile-menu .close").classList.contains("active")){
            document.querySelector(".mobile-menu .close").classList.add("active");
        }
        if(!document.querySelector(".side-menu").classList.contains("active")){
            document.querySelectorAll(".side-menu").forEach(item=>{
                item.classList.add("active");
            })
        }
    }
    else if(isMenuOpen){
        if(!document.querySelector(".mobile-menu .burger").classList.contains("active")){
            document.querySelector(".mobile-menu .burger").classList.add("active");
        }
        if(document.querySelector(".mobile-menu .close").classList.contains("active")){
            document.querySelector(".mobile-menu .close").classList.remove("active");
        }
        if(document.querySelector(".side-menu").classList.contains("active")){
            document.querySelectorAll(".side-menu").forEach(item=>{
                item.classList.remove("active");
            })
        }
    }
    isMenuOpen = !isMenuOpen;
	
	
	
const goodHealthMenuItems = document.querySelectorAll('a[href*="good-health"]');
if(!isMenuOpen) {
goodHealthMenuItems[0].parentElement.classList.remove('submenu-show');
}

});

document.addEventListener('DOMContentLoaded', () => {
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
	});
	}
	});
	}
});


function getDistanceFromElementToDocumentEnd(element) {
    // 1. Get the element's position relative to the viewport
    const rect = element.getBoundingClientRect();

    // 2. Get the vertical scroll position of the window
    // window.scrollY is widely supported, window.pageYOffset is an older alias
    const scrollY = window.scrollY || window.pageYOffset;

    // 3. Get the total height of the document
    // This is the most robust way to get the full document height,
    // accounting for different browser behaviors.
    const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
    );

    // 4. Calculate the distance from the top of the element to the top of the document
    // rect.top gives the position relative to the viewport.
    // Add scrollY to get the position relative to the document's top.
    const elementTopInDocument = rect.top + scrollY;

    // 5. Calculate the distance from the top of the element to the end of the document
    return documentHeight - elementTopInDocument;
}

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
	const goodHealthMenuItems = document.querySelectorAll('a[href*="good-health"] + ul')[0];
	
	if(!goodHealthMenuItems.classList.contains("positioned"))
		positionFlyingSubmenu();
}
