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

        self.$context = context;
        self.$container = null;
        self.$slides = null;

        self.init = function (options) {

        }

        self.setup = function () {

        }

        self.initSlides = function () {

        }

        self.initArrows = function () {

        }

        self.start = function () {

        }

        self.stop = function () {

        }

        self.scroll = function () {

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