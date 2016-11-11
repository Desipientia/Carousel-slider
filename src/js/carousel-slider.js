(function ($) {

    $.Carousel = function (context, options) {
        var self = this;

        self.defaults = {
            // The number of items to display, odd only, 9 maximum
            num: 3,

            // Should the carousel move on its own?
            autoPlay: true,

            // Delay between sliders moving in milliseconds
            showTime: 3000,

            // Animation speed in milliseconds
            animationTime: 500,

            // Scale of unactive items (0 - 1.0)
            scale: 0.6,

            // The % of unactive items displayed (50 - half of the item)
            unactive: 50,

            // HTML tags to display carousel
            selectors: {
                container: 'ul:first',
                slides: 'li'
            }
        }

        self.options = {};
        self.total = 0;
        self.current = 0;
        self.displayStyles = [];

        self.$context = context;
        self.$container = null;
        self.$slides = null;

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
        }

        self.initSlides = function () {
            var halfNum = (self.options.num - 1) / 2;

            var s = self.options.scale,
                n = self.options.num,
                u = self.options.unactive / 100;

            var scaleSum = s * (1 - Math.pow(s, n - halfNum - 1)) / (1 - s),
                activeWidth = 1 / (1 + 2 * u * scaleSum) * 100;

            for (i = halfNum; i >= 0; i--) {
                self.displayStyles[i] = {
                    position: i >= halfNum ? 0 : self.displayStyles[i + 1].position + self.displayStyles[i + 1].width * u,
                    zindex: 1000 - i,
                    width: activeWidth * Math.pow(s, i),
                };
            }

            self.scroll(self.current);
        }

        self.initArrows = function () {

        }

        self.start = function () {

        }

        self.stop = function () {

        }

        self.scroll = function (currentIndex) {
            var halfNum = (self.options.num - 1) / 2,
                displayIndexes = [];

            for (i = -halfNum; i <= halfNum; i++) {
                var position = currentIndex + i,
                    index = (position < 0 ? position + self.total : position) % self.total;

                displayIndexes[index] = i;
            }

            self.$slides.each(function (index, target) {
                if (displayIndexes[index] !== undefined) {
                    var displayIndex = displayIndexes[index],
                        styleIndex = Math.abs(displayIndex);
                        position = displayIndex <= 0 ? 'left' : 'right',
                        style = self.displayStyles[styleIndex];

                    $(target).css({
                        [position]: style.position + '%',
                        'z-index': style.zindex,
                        width: style.width + '%'
                    }).addClass(index === currentIndex ? 'active' : '');

                } else {
                    var lastDisplayedStyle = self.displayStyles[halfNum],
                        width = lastDisplayedStyle.width * self.options.scale;

                    $(target).css({
                        left: (100 - width) / 2 + '%',
                        'z-index': 900,
                        width: width + '%'
                    }).addClass('hidden');
                }
            });

            self.current = currentIndex;
        }

        self.next = function () {

        }

        self.prev = function () {

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