(function ($) {

    $.Carousel = function (context, options) {
        var self = this;

        self.defaults = {
            // The number of items to display, odd only, 9 maximum
            num: 3,

            // Should the carousel move on its own?
            autoplay: true,

            // Delay between sliders moving in milliseconds
            showTime: 3000,

            // Animation speed in milliseconds
            animationTime: 600,

            // Scale of unactive items (0 - 1.0)
            scale: 0.6,

            // The % of unactive items displayed (50 - half of the item)
            unactive: 50,

            // HTML tags to display carousel
            selectors: {
                container: 'ul:first',
                slides: 'li'
            },

            // Left/right arrows to go back/forth
            arrows: {
                prev: '<a class="arrow prev">Prev</a>',
                next: '<a class="arrow next">Next</a>'
            },

            // Keyboard arrows
            keys: {
                prev: 37,
                next: 39
            }
        }

        self.options = {};
        self.displayStyles = {};
        self.total = 0;
        self.current = 0;
        self.interval = null;

        self.$context = context;
        self.$container = null;
        self.$slides = null;
        self.$arrows = [];

        self.init = function (options) {
            self.options = $.extend({}, self.defaults, options);

            self.$container = self.$context.find(self.options.selectors.container).addClass('carousel-slider');
            self.$slides = self.$container.children(self.options.selectors.slides);

            self.total = self.$slides.length;
            if (self.total <= 0) {
                return console.warn('Carousel: Add some items.');
            }

            self.setup();
            self.initSlides();
            self.initArrows();
            self.initKeys();
            self.options.autoplay && self.start();

            return self;
        }

        self.setup = function () {
            self.$context.addClass('carousel-slider-container');

            if (self.options.num <= 0 || self.options.num > self.total) {
                console.warn('Carousel: Incorrect number of items to display, set to default.');
                self.options.num = self.defaults.num;
            }
            if (self.options.num % 2 === 0) {
                console.warn('Carousel: Must be odd number of items to display, set to default.');
                self.options.num = self.defaults.num;
            }
            if (self.options.num > 9) {
                console.warn('Carousel: Too many items to display, set to 9.');
                self.options.num = 9;
            }
            if (self.options.showTime < self.options.animationTime) {
                console.warn('Carousel: Too fast autoplay, set to default.');
                self.options.showTime = self.defaults.showTime;
            }
        }

        self.initSlides = function () {
            var halfNum = (self.options.num - 1) / 2;

            var s = self.options.scale,
                n = self.options.num,
                u = self.options.unactive / 100;

            var scaleSum = s * (1 - Math.pow(s, n - halfNum - 1)) / (1 - s),
                activeWidth = 1 / (1 + 2 * u * scaleSum) * 100;

            for (i = -halfNum; i <= halfNum; i++) {
                self.displayStyles[i] = {
                    left: i <= -halfNum ? 0 :
                        i <= 0 ? self.displayStyles[i - 1].left + self.displayStyles[i - 1].width * u :
                        100 - self.displayStyles[-i].left - self.displayStyles[-i].width,
                    zindex: 1000 - Math.abs(i),
                    width: activeWidth * Math.pow(s, Math.abs(i)),
                };
            }

            self.scroll(self.current, 0);
        }

        self.initArrows = function () {
            $.each(self.options.arrows, function(key, value) {
                self.$arrows.push(
                    $(value).insertAfter(self.$container).addClass('carousel-arrow').on('click', self[key])
                );
            });
        }

        self.initKeys = function () {
            $(document).on('keyup', function (e) {
                $.each(self.options.keys, function(key, value) {
                    if(e.which === value) {
                        $.isFunction(self[key]) && self[key].call(self);
                    }
                });
            });
        }

        self.start = function () {
            self.interval = setTimeout(function () {
                self.next();
            }, self.options.showTime);

            return self;
        }

        self.stop = function () {
            clearTimeout(self.interval);

            return self;
        }

        self.scroll = function (to, animationTime) {

            if (self.$container.data('animating')) {
                return;
            }

            var halfNum = (self.options.num - 1) / 2,
                displayIndexes = [];

            for (i = -halfNum; i <= halfNum; i++) {
                var position = to + i,
                    index = (position < 0 ? position + self.total : position) % self.total;

                displayIndexes[index] = i;
            }

            if (animationTime === undefined) {
                animationTime = self.animationTime;
            }

            self.$slides.each(function (index, target) {
                if (displayIndexes[index] !== undefined) {
                    var displayIndex = displayIndexes[index],
                        style = self.displayStyles[displayIndex],
                        zindex = self.current !== index && to !== index ? style.zindex - 1 : style.zindex;

                    self.$container.data('animating', true);
                    $(target).removeClass('hidden active unactive').addClass(index === to ? 'active' : 'unactive')
                    .css({
                        'z-index': zindex,
                    }).animate({
                        display: 'block',
                        left: style.left + '%',
                        width: style.width + '%'
                    }, animationTime, function () {
                        self.$container.data('animating', false);
                    });

                } else {
                    var width = self.displayStyles[halfNum].width * self.options.scale;

                    $(target).removeClass('active unactive').addClass('hidden')
                    .css({
                        'z-index': -1,
                    }).animate({
                        display: 'none',
                        left: (100 - width) / 2 + '%',
                        width: width + '%'
                    }, animationTime);
                }
            });

            self.current = to;
        }

        self.next = function () {
            var target = self.current + 1;

            if (target >= self.total) {
                target = 0;
            }

            self.scroll(target);

            if(self.options.autoplay) {
                self.stop().start();
            }
        }

        self.prev = function () {
            var target = self.current - 1;

            if (target < 0) {
                target = self.total - 1;
            }

            self.scroll(target);
        }

        return self.init(options);
    }

    $.fn.carousel = function (options) {
        return this.each(function (index, target) {
            var $target = $(target);
            var carousel = $target.data('carousel');

            if (carousel instanceof $.Carousel) {
                return;
            }

            return $target.data('carousel', new $.Carousel($target, options));
        });
    }

})(jQuery)