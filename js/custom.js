// Responsive sub nav class toggle
$("#mobile-sub-nav-toggle").click(function() {
    $("#mobile-sub-nav").toggleClass("expand-height");
});

// Morphing Search
(function() {
    var morphSearch = document.getElementById('morphsearch'),
        input = morphSearch.querySelector('input.morphsearch-input'),
        ctrlClose = morphSearch.querySelector('span.morphsearch-close'),
        isOpen = isAnimating = false,
        // show/hide search area
        toggleSearch = function(evt) {
            // return if open and the input gets focused
            if (evt.type.toLowerCase() === 'focus' && isOpen) return false;

            var offsets = morphsearch.getBoundingClientRect();
            if (isOpen) {
                classie.remove(morphSearch, 'open');

                // trick to hide input text once the search overlay closes 
                // todo: hardcoded times, should be done after transition ends
                if (input.value !== '') {
                    setTimeout(function() {
                        classie.add(morphSearch, 'hideInput');
                        setTimeout(function() {
                            classie.remove(morphSearch, 'hideInput');
                            input.value = '';
                        }, 300);
                    }, 500);
                }

                input.blur();
            } else {
                classie.add(morphSearch, 'open');
            }
            isOpen = !isOpen;
        };

    // events
    input.addEventListener('focus', toggleSearch);
    ctrlClose.addEventListener('click', toggleSearch);
    // esc key closes search overlay
    // keyboard navigation events
    document.addEventListener('keydown', function(ev) {
        var keyCode = ev.keyCode || ev.which;
        if (keyCode === 27 && isOpen) {
            toggleSearch(ev);
        }
    });

    /***** for demo purposes only: don't allow to submit the form *****/
    morphSearch.querySelector('button[type="submit"]').addEventListener('click', function(ev) {
        ev.preventDefault();
    });
})();

// Slider
(function() {

    function init(item) {
        var items = item.querySelectorAll('li.slide-list'),
            current = 0,
            autoUpdate = true,
            timeTrans = 5000;

        //create nav
        var nav = document.createElement('nav');
        nav.className = 'nav_arrows';

        //create button prev
        var prevbtn = document.createElement('button');
        prevbtn.className = 'prev';
        prevbtn.setAttribute('aria-label', 'Prev');

        //create button next
        var nextbtn = document.createElement('button');
        nextbtn.className = 'next';
        nextbtn.setAttribute('aria-label', 'Next');

        //create counter
        var counter = document.createElement('div');
        counter.className = 'counter';
        counter.innerHTML = "<span>1</span><span>" + items.length + "</span>";

        if (items.length > 1) {
            nav.appendChild(prevbtn);
            nav.appendChild(counter);
            nav.appendChild(nextbtn);
            item.appendChild(nav);
        }

        items[current].className = "current";
        if (items.length > 1) items[items.length - 1].className = "prev_slide";

        var navigate = function(dir) {
            items[current].className = "";

            if (dir === 'right') {
                current = current < items.length - 1 ? current + 1 : 0;
            } else {
                current = current > 0 ? current - 1 : items.length - 1;
            }

            var nextCurrent = current < items.length - 1 ? current + 1 : 0,
                prevCurrent = current > 0 ? current - 1 : items.length - 1;

            items[current].className = "current";
            items[prevCurrent].className = "prev_slide";
            items[nextCurrent].className = "";

            //update counter
            counter.firstChild.textContent = current + 1;
        }

        item.addEventListener('mouseenter', function() {
            autoUpdate = false;
        });

        item.addEventListener('mouseleave', function() {
            autoUpdate = true;
        });

        setInterval(function() {
            if (autoUpdate) navigate('right');
        }, timeTrans);

        prevbtn.addEventListener('click', function() {
            navigate('left');
        });

        nextbtn.addEventListener('click', function() {
            navigate('right');
        });

        //keyboard navigation
        document.addEventListener('keydown', function(ev) {
            var keyCode = ev.keyCode || ev.which;
            switch (keyCode) {
                case 37:
                    navigate('left');
                    break;
                case 39:
                    navigate('right');
                    break;
            }
        });

        // swipe navigation
        item.addEventListener('touchstart', handleTouchStart, false);
        item.addEventListener('touchmove', handleTouchMove, false);
        var xDown = null;
        var yDown = null;

        function handleTouchStart(evt) {
            xDown = evt.touches[0].clientX;
            yDown = evt.touches[0].clientY;
        };

        function handleTouchMove(evt) {
            if (!xDown || !yDown) {
                return;
            }

            var xUp = evt.touches[0].clientX;
            var yUp = evt.touches[0].clientY;

            var xDiff = xDown - xUp;
            var yDiff = yDown - yUp;

            if (Math.abs(xDiff) > Math.abs(yDiff)) { /*most significant*/
                if (xDiff > 0) {
                    /* left swipe */
                    navigate('right');
                } else {
                    navigate('left');
                }
            }
            /* reset values */
            xDown = null;
            yDown = null;
        };

    }

    [].slice.call(document.querySelectorAll('.cd-slider')).forEach(function(item) {
        init(item);
    });

})();