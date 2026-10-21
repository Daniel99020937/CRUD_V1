<?php
// Limpa qualquer cache residual de redirecionamento do Apache e força a Landing Page
header("Clear-Site-Data: 'cache'");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Location: http://localhost/meu-projeto-saas/frontend/index.html");
exit();
?>
