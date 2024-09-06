(function($) {
    $(document).ready(function() {
        const canvas = document.getElementById('lucky-wheel');
        const ctx = canvas.getContext('2d');
        const wheelCenter = document.getElementById('wheel-center');
        const spinText = document.getElementById('spin-text');
        const resultDiv = document.getElementById('result');

        const wheelConfig = {
            segments: [
                {color: "#FF6B6B", label: "Prize 1"},
                {color: "#4ECDC4", label: "Prize 2"},
                {color: "#45B7D1", label: "Prize 3"},
                {color: "#F7DC6F", label: "Prize 4"},
                {color: "#B8E994", label: "Prize 5"},
                {color: "#FF9FF3", label: "Prize 6"}
            ],
            centerX: canvas.width / 2,
            centerY: canvas.height / 2,
            radius: 145,
            textDistance: 60
        };

        let isSpinning = false;
        let startAngle = 0;

        function drawWheel() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(wheelConfig.centerX, wheelConfig.centerY);

            const segmentAngle = (Math.PI * 2) / wheelConfig.segments.length;
            for (let i = 0; i < wheelConfig.segments.length; i++) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, wheelConfig.radius, startAngle + segmentAngle * i, startAngle + segmentAngle * (i + 1));
                ctx.lineTo(0, 0);
                ctx.fillStyle = wheelConfig.segments[i].color;
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Add shading
                ctx.save();
                ctx.clip();
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, wheelConfig.radius);
                gradient.addColorStop(0, 'rgba(255,255,255,0.2)');
                gradient.addColorStop(1, 'rgba(0,0,0,0.2)');
                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.restore();

                // Draw text
                ctx.save();
                ctx.rotate(startAngle + segmentAngle * (i + 0.5));
                ctx.textAlign = 'right';
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 16px Arial';
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                ctx.shadowBlur = 5;
                ctx.fillText(wheelConfig.segments[i].label, wheelConfig.radius - wheelConfig.textDistance, 5);
                ctx.restore();
            }

            ctx.restore();
        }

        function easeOut(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function spinWheel() {
            if (isSpinning) return;
            isSpinning = true;
            wheelCenter.classList.add('spinning');
            spinText.style.opacity = '0';
            resultDiv.textContent = '';

            const totalRotation = 5 * Math.PI * 2 + Math.random() * Math.PI * 2;
            const duration = 5000;
            const start = performance.now();

            function animate(time) {
                const elapsed = time - start;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = easeOut(progress);
            
                startAngle = easeProgress * totalRotation;
                drawWheel();
            
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    isSpinning = false;
                    wheelCenter.classList.remove('spinning');
                    
                    // Calculate the winning segment
                    let finalAngle = startAngle % (Math.PI * 2);
                    if (finalAngle < 0) finalAngle += Math.PI * 2;
                    const segmentAngle = (Math.PI * 2) / wheelConfig.segments.length;
                    
                    // Adjust the final angle to account for the pointer's starting position
                    const pointerOffset = Math.PI / 2; // Assuming the pointer starts at the top (90 degrees)
                    finalAngle = (finalAngle + pointerOffset) % (Math.PI * 2);
                    
                    // Calculate the winning segment index
                    const winningSegmentIndex = Math.floor((Math.PI * 2 - finalAngle) / segmentAngle) % wheelConfig.segments.length;
                    
                    const winningSegment = wheelConfig.segments[winningSegmentIndex];
                    resultDiv.textContent = "You won: " + winningSegment.label;
                    resultDiv.classList.add('show');
                    setTimeout(() => resultDiv.classList.remove('show'), 500);
                }
            }

            requestAnimationFrame(animate);
        }

        wheelCenter.addEventListener('click', spinWheel);
        drawWheel();
    });
})(jQuery);