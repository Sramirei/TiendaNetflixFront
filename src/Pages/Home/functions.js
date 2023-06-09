import { useEffect } from 'react';
import $ from 'jquery';

const initializeCursors = () => {
  $(document).ready(function() {
    // Page cursors
    $('body').on('mousemove', function(n) {
      const t = $('#cursor');
      const e = $('#cursor2');
      const i = $('#cursor3');
      const y = $('#cursor4');
      const z = $('#cursor5');
      const b = $('#cursor6');
      const k = $('#cursor7');
      const o = $('#cursor8');

      t.css({
        left: n.clientX + 'px',
        top: n.clientY + 'px',
      });
      e.css({
        left: n.clientX + 'px',
        top: n.clientY + 'px',
      });
      i.css({
        left: n.clientX + 'px',
        top: n.clientY + 'px',
      });
      y.css({
        left: n.clientX + 'px',
        top: n.clientY + 'px',
      });
      z.css({
        left: n.clientX + 'px',
        top: n.clientY + 'px',
      });
      b.css({
        left: n.clientX + 'px',
        top: n.clientY + 'px',
      });
      k.css({
        left: n.clientX + 'px',
        top: n.clientY + 'px',
      });
      o.css({
        left: n.clientX + 'px',
        top: n.clientY + 'px',
      });
    });

    function handleMouseOver() {
      const e = $('#cursor2');
      const i = $('#cursor3');
      const y = $('#cursor4');
      const z = $('#cursor5');
      const b = $('#cursor6');
      const k = $('#cursor7');
      const o = $('#cursor8');
      e.addClass('hover');
      i.addClass('hover');
      y.addClass('hover');
      z.addClass('hover');
      b.addClass('hover');
      k.addClass('hover');
      o.addClass('hover');
    }

    function handleMouseOut() {
      const e = $('#cursor2');
      const i = $('#cursor3');
      const y = $('#cursor4');
      const z = $('#cursor5');
      const b = $('#cursor6');
      const k = $('#cursor7');
      const o = $('#cursor8');
      e.removeClass('hover');
      i.removeClass('hover');
      y.removeClass('hover');
      z.removeClass('hover');
      b.removeClass('hover');
      k.removeClass('hover');
      o.removeClass('hover');
    }

    handleMouseOut();

    $('.hover-target').each(function() {
      $(this).on('mouseover', handleMouseOver);
      $(this).on('mouseout', handleMouseOut);
    });

    // Hero Case study images

    $('.case-study-name:nth-child(1)').on('mouseenter', function() {
      $('.case-study-name.active').removeClass('active');
      $('.case-study-images li.show').removeClass('show');
      $('.case-study-images li:nth-child(1)').addClass('show');
      $('.case-study-name:nth-child(1)').addClass('active');
    });
    $('.case-study-name:nth-child(2)').on('mouseenter', function() {
      $('.case-study-name.active').removeClass('active');
      $('.case-study-images li.show').removeClass('show');
      $('.case-study-images li:nth-child(2)').addClass('show');
      $('.case-study-name:nth-child(2)').addClass('active');
    });
    $('.case-study-name:nth-child(3)').on('mouseenter', function() {
      $('.case-study-name.active').removeClass('active');
      $('.case-study-images li.show').removeClass('show');
      $('.case-study-images li:nth-child(3)').addClass('show');
      $('.case-study-name:nth-child(3)').addClass('active');
    });
    $('.case-study-name:nth-child(4)').on('mouseenter', function() {
      $('.case-study-name.active').removeClass('active');
      $('.case-study-images li.show').removeClass('show');
      $('.case-study-images li:nth-child(4)').addClass('show');
      $('.case-study-name:nth-child(4)').addClass('active');
    });
    $('.case-study-name:nth-child(5)').on('mouseenter', function() {
      $('.case-study-name.active').removeClass('active');
      $('.case-study-images li.show').removeClass('show');
      $('.case-study-images li:nth-child(5)').addClass('show');
      $('.case-study-name:nth-child(5)').addClass('active');
    });
    $('.case-study-name:nth-child(6)').on('mouseenter', function() {
      $('.case-study-name.active').removeClass('active');
      $('.case-study-images li.show').removeClass('show');
      $('.case-study-images li:nth-child(6)').addClass('show');
      $('.case-study-name:nth-child(6)').addClass('active');
    });
    $('.case-study-name:nth-child(7)').on('mouseenter', function() {
      $('.case-study-name.active').removeClass('active');
      $('.case-study-images li.show').removeClass('show');
      $('.case-study-images li:nth-child(7)').addClass('show');
      $('.case-study-name:nth-child(7)').addClass('active');
    });
    $('.case-study-name:nth-child(8)').on('mouseenter', function() {
      $('.case-study-name.active').removeClass('active');
      $('.case-study-images li.show').removeClass('show');
      $('.case-study-images li:nth-child(8)').addClass('show');
      $('.case-study-name:nth-child(8)').addClass('active');
    });

    $('.case-study-name:nth-child(1)').trigger('mouseenter');
  });
};

export { initializeCursors };