// Keep the navigation and contact panels independent, including icon/text clicks.
(function () {
    window.addEventListener('click', function (event) {
        var trigger = event.target.closest('[data-toggle="collapse-headermenu"], [data-toggle="collapse-footermenu"]');
        if (!trigger) return;

        var button = trigger.closest('button');
        if (!button) return;

        var expanded = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(expanded));
        document.querySelectorAll(button.getAttribute('data-target')).forEach(function (panel) {
            panel.classList.toggle('show', expanded);
        });
    });

    $(document).ready(function () {
        $('.left-menu-portlet').each(function () {
            $("a:contains('HOTLINE')").css({color: 'red'});
        });
    });
}());
