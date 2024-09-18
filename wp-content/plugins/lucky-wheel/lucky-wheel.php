<?php
/**
 * Plugin Name: Lucky Wheel with Registration Form
 * Description: Implements a lucky wheel feature with a registration form
 * Version: 2.1
 * Author: Your Name
 */

function lucky_wheel_enqueue_scripts() {
    wp_enqueue_style('lucky-wheel-style', plugin_dir_url(__FILE__) . 'css/lucky-wheel.css');
    wp_enqueue_script('lucky-wheel-script', plugin_dir_url(__FILE__) . 'js/lucky-wheel.js', array('jquery'), '2.1', true);
    wp_localize_script('lucky-wheel-script', 'lucky_wheel_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php')
    ));
}
add_action('wp_enqueue_scripts', 'lucky_wheel_enqueue_scripts');

function lucky_wheel_shortcode() {
    ob_start();
    ?>
    <div class="lucky-wheel-wrapper">
        <div class="lucky-wheel-container">
            <div id="registration-form" class="registration-form">
                <h2>Vui lòng nhập thông tin để bắt đầu trò chơi</h2>
                <form id="lucky-wheel-form">
                    <input type="text" name="name" placeholder="Họ tên" required>
                    <input type="email" name="email" placeholder="Email" required>
                    <input type="tel" name="phone" placeholder="Số điện thoại" required>
                    <input type="text" name="website" placeholder="Website / Fanpage">
                    <button type="submit">Bắt đầu</button>
                </form>
            </div>
            <div id="lucky-wheel-game" class="lucky-wheel-game">
                <div class="wheel-overlay"></div>
                <canvas id="lucky-wheel" width="300" height="300"></canvas>
                <div id="wheel-center" class="wheel-center">
                    <span id="spin-text">SPIN</span>
                </div>
                <div class="wheel-pointer">
                    <div class="pointer-base"></div>
                    <div class="pointer-triangle"></div>
                </div>
            </div>
        </div>
        <div id="result" class="result-display"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('lucky_wheel', 'lucky_wheel_shortcode');

function handle_registration_form() {
    // Process form data here
    wp_send_json_success('Registration successful!');
}
add_action('wp_ajax_lucky_wheel_register', 'handle_registration_form');
add_action('wp_ajax_nopriv_lucky_wheel_register', 'handle_registration_form');