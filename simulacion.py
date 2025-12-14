#simulacion 4 Ley de Ohm
import pygame
import random
import math

# Inicializar pygame
pygame.init()

# Colores mejorados
AZUL_OSCURO = (0, 100, 200)
AZUL_CLARO = (100, 180, 255)
AZUL_PARTICULA = (50, 150, 255)
GRIS_OSCURO = (100, 100, 100)
GRIS_CLARO = (180, 180, 180)
NEGRO = (20, 20, 30)
BLANCO = (255, 255, 255)
AMARILLO = (255, 220, 0)
VERDE = (0, 255, 100)
ROJO = (255, 80, 80)
NARANJA = (255, 165, 0)

# Dimensiones de pantalla
ANCHO = 1000
ALTO = 600
pantalla = pygame.display.set_mode((ANCHO, ALTO))
pygame.display.set_caption("Simulación Interactiva - Ley de Ohm")

# Fuentes
fuente_titulo = pygame.font.SysFont("Arial", 28, bold=True)
fuente_normal = pygame.font.SysFont("Arial", 20)
fuente_pequena = pygame.font.SysFont("Arial", 16)


class Particula:
    """Clase para representar cada partícula de flujo"""
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.velocidad_x = 0
        self.radio = random.randint(3, 5)
        self.color = AZUL_PARTICULA
        self.brillo = random.randint(200, 255)
    
    def actualizar(self, velocidad, resistencia):
        """Actualiza la posición de la partícula"""
        self.velocidad_x = velocidad
        
        # Movimiento con variación aleatoria
        self.x += self.velocidad_x + random.uniform(-0.5, 0.5)
        self.y += random.uniform(-0.8, 0.8)
        
        # Efecto de estrechamiento en la zona de resistencia
        if 420 < self.x < 420 + max(20, 150 - resistencia * 10):
            self.y += random.uniform(-1.5, 1.5)
        
        # Mantener dentro de la tubería
        self.y = max(170, min(230, self.y))
        
        # Reiniciar si sale de la pantalla
        if self.x > 900:
            self.x = random.randint(50, 150)
            self.y = random.randint(170, 230)
    
    def dibujar(self, superficie):
        """Dibuja la partícula con efecto de brillo"""
        # Efecto de brillo
        color_brillo = (
            min(255, self.color[0] + self.brillo // 3),
            min(255, self.color[1] + self.brillo // 3),
            min(255, self.color[2] + self.brillo // 3)
        )
        pygame.draw.circle(superficie, color_brillo, (int(self.x), int(self.y)), self.radio)
        pygame.draw.circle(superficie, BLANCO, (int(self.x), int(self.y)), self.radio // 2)


class Simulacion:
    """Clase principal de la simulación"""
    def __init__(self):
        self.voltaje = 5
        self.resistencia = 5
        self.corriente = 0
        self.potencia = 0
        self.particulas = []
        self.historia_corriente = []
        self.pausa = False
        self.mostrar_ayuda = True
        
        # Generar partículas iniciales
        self.generar_particulas(100)
    
    def generar_particulas(self, cantidad):
        """Genera partículas en posiciones aleatorias"""
        self.particulas = []
        for _ in range(cantidad):
            x = random.randint(50, 400)
            y = random.randint(170, 230)
            self.particulas.append(Particula(x, y))
    
    def calcular_valores(self):
        """Calcula corriente y potencia según la Ley de Ohm"""
        self.corriente = self.voltaje / self.resistencia
        self.potencia = self.voltaje * self.corriente
        
        # Guardar historial para la gráfica
        self.historia_corriente.append(self.corriente)
        if len(self.historia_corriente) > 200:
            self.historia_corriente.pop(0)
    
    def actualizar(self):
        """Actualiza el estado de la simulación"""
        if not self.pausa:
            self.calcular_valores()
            velocidad = self.corriente * 3
            
            for particula in self.particulas:
                particula.actualizar(velocidad, self.resistencia)
    
    def dibujar_tuberia(self, superficie):
        """Dibuja la tubería con efectos visuales"""
        # Tubería principal con gradiente
        pygame.draw.rect(superficie, GRIS_OSCURO, (50, 150, 850, 100))
        pygame.draw.rect(superficie, GRIS_CLARO, (50, 150, 850, 100), 3)
        
        # Zona de entrada (fuente de voltaje)
        pygame.draw.rect(superficie, AMARILLO, (30, 140, 40, 120))
        pygame.draw.rect(superficie, NARANJA, (30, 140, 40, 120), 3)
        self.dibujar_texto("+", 45, 200, fuente_titulo, NEGRO)
        
        # Zona de resistencia (estrechamiento)
        ancho_resistencia = max(20, 150 - self.resistencia * 10)
        x_resistencia = 420
        
        # Dibujar estrechamiento con gradiente
        color_resistencia = (
            min(255, 120 + self.resistencia * 10),
            max(50, 120 - self.resistencia * 5),
            50
        )
        pygame.draw.rect(superficie, color_resistencia, 
                        (x_resistencia, 150, ancho_resistencia, 100))
        pygame.draw.rect(superficie, ROJO, 
                        (x_resistencia, 150, ancho_resistencia, 100), 3)
        
        # Etiquetas
        self.dibujar_texto("RESISTENCIA", x_resistencia + ancho_resistencia // 2 - 60, 
                          120, fuente_pequena, BLANCO)
        
        # Zona de salida
        pygame.draw.rect(superficie, GRIS_OSCURO, (880, 140, 40, 120))
        pygame.draw.rect(superficie, GRIS_CLARO, (880, 140, 40, 120), 3)
        self.dibujar_texto("-", 895, 200, fuente_titulo, BLANCO)
    
    def dibujar_panel_info(self, superficie):
        """Dibuja el panel de información"""
        # Fondo del panel
        pygame.draw.rect(superficie, (30, 30, 40), (20, 280, 960, 300))
        pygame.draw.rect(superficie, AZUL_CLARO, (20, 280, 960, 300), 2)
        
        # Título
        self.dibujar_texto("PANEL DE CONTROL - LEY DE OHM", 350, 295, 
                          fuente_titulo, AMARILLO)
        
        # Valores actuales
        y_base = 340
        espaciado = 45
        
        # Voltaje
        color_v = self.obtener_color_intensidad(self.voltaje, 1, 15, VERDE, ROJO)
        self.dibujar_texto(f"⚡ Voltaje (V):", 40, y_base, fuente_normal, BLANCO)
        self.dibujar_texto(f"{self.voltaje:.1f} V", 250, y_base, fuente_normal, color_v)
        self.dibujar_barra(40, y_base + 25, 250, 15, self.voltaje, 15, color_v)
        
        # Resistencia
        color_r = self.obtener_color_intensidad(self.resistencia, 1, 15, VERDE, ROJO)
        self.dibujar_texto(f"⊗ Resistencia (R):", 40, y_base + espaciado, fuente_normal, BLANCO)
        self.dibujar_texto(f"{self.resistencia:.1f} Ω", 250, y_base + espaciado, fuente_normal, color_r)
        self.dibujar_barra(40, y_base + espaciado + 25, 250, 15, self.resistencia, 15, color_r)
        
        # Corriente (calculada)
        color_i = self.obtener_color_intensidad(self.corriente, 0.5, 10, VERDE, ROJO)
        self.dibujar_texto(f"〰 Corriente (I = V/R):", 40, y_base + espaciado * 2, 
                          fuente_normal, BLANCO)
        self.dibujar_texto(f"{self.corriente:.2f} A", 250, y_base + espaciado * 2, 
                          fuente_normal, color_i)
        self.dibujar_barra(40, y_base + espaciado * 2 + 25, 250, 15, self.corriente, 10, color_i)
        
        # Potencia
        self.dibujar_texto(f"⚙ Potencia (P = V×I):", 40, y_base + espaciado * 3, 
                          fuente_normal, BLANCO)
        self.dibujar_texto(f"{self.potencia:.2f} W", 250, y_base + espaciado * 3, 
                          fuente_normal, NARANJA)
        
        # Gráfica de corriente
        self.dibujar_grafica(superficie, 550, 320, 400, 150)
        
        # Controles
        self.dibujar_texto("CONTROLES:", 40, y_base + espaciado * 4, fuente_pequena, AMARILLO)
        self.dibujar_texto("↑/↓ Voltaje  |  ←/→ Resistencia  |  ESPACIO Pausa  |  R Reiniciar  |  H Ayuda", 
                          40, y_base + espaciado * 4 + 20, fuente_pequena, BLANCO)
    
    def dibujar_barra(self, x, y, ancho, alto, valor, max_valor, color):
        """Dibuja una barra de progreso"""
        # Fondo
        pygame.draw.rect(pantalla, GRIS_OSCURO, (x, y, ancho, alto))
        # Progreso
        progreso = min(1.0, valor / max_valor)
        pygame.draw.rect(pantalla, color, (x, y, int(ancho * progreso), alto))
        # Borde
        pygame.draw.rect(pantalla, BLANCO, (x, y, ancho, alto), 1)
    
    def obtener_color_intensidad(self, valor, min_val, max_val, color_min, color_max):
        """Interpola color según el valor"""
        progreso = min(1.0, (valor - min_val) / (max_val - min_val))
        r = int(color_min[0] + (color_max[0] - color_min[0]) * progreso)
        g = int(color_min[1] + (color_max[1] - color_min[1]) * progreso)
        b = int(color_min[2] + (color_max[2] - color_min[2]) * progreso)
        return (r, g, b)
    
    def dibujar_grafica(self, superficie, x, y, ancho, alto):
        """Dibuja gráfica de corriente en tiempo real"""
        # Fondo de la gráfica
        pygame.draw.rect(superficie, (20, 20, 30), (x, y, ancho, alto))
        pygame.draw.rect(superficie, AZUL_CLARO, (x, y, ancho, alto), 2)
        
        # Título
        self.dibujar_texto("Corriente en tiempo real", x + 10, y + 5, 
                          fuente_pequena, BLANCO)
        
        if len(self.historia_corriente) > 1:
            # Encontrar valor máximo para escalar
            max_corriente = max(self.historia_corriente) if self.historia_corriente else 1
            
            # Dibujar línea de la gráfica
            puntos = []
            for i, corriente in enumerate(self.historia_corriente):
                px = x + (i / len(self.historia_corriente)) * ancho
                py = y + alto - (corriente / max(max_corriente, 1)) * (alto - 30)
                puntos.append((px, py))
            
            if len(puntos) > 1:
                pygame.draw.lines(superficie, VERDE, False, puntos, 2)
        
        # Líneas de referencia
        for i in range(5):
            py = y + 30 + i * (alto - 30) // 4
            pygame.draw.line(superficie, GRIS_OSCURO, (x, py), (x + ancho, py), 1)
    
    def dibujar_ayuda(self, superficie):
        """Dibuja el panel de ayuda"""
        if not self.mostrar_ayuda:
            return
        
        # Fondo semi-transparente - reposicionado a la derecha
        s = pygame.Surface((300, 250))
        s.set_alpha(230)
        s.fill((30, 30, 40))
        superficie.blit(s, (680, 20))
        pygame.draw.rect(superficie, AMARILLO, (680, 20, 300, 250), 2)
        
        # Contenido de ayuda
        ayuda = [
            "LEY DE OHM: V = I × R",
            "",
            "V = Voltaje (Voltios)",
            "I = Corriente (Amperios)",
            "R = Resistencia (Ohmios)",
            "",
            "↑/↓ : Voltaje",
            "←/→ : Resistencia",
            "ESPACIO: Pausa",
            "R: Reiniciar",
            "H: Ayuda o esconder"
        ]
        
        y_pos = 35
        for linea in ayuda:
            color = AMARILLO if "LEY DE OHM" in linea else BLANCO
            fuente = fuente_normal if "LEY DE OHM" in linea else fuente_pequena
            self.dibujar_texto(linea, 695, y_pos, fuente, color)
            y_pos += 20
    
    def dibujar_texto(self, texto, x, y, fuente, color):
        """Dibuja texto en pantalla"""
        img = fuente.render(texto, True, color)
        pantalla.blit(img, (x, y))
    
    def dibujar(self, superficie):
        """Dibuja todos los elementos de la simulación"""
        # Fondo con gradiente
        superficie.fill(NEGRO)
        
        # Título principal
        self.dibujar_texto("SIMULACIÓN INTERACTIVA - LEY DE OHM", 250, 20, 
                          fuente_titulo, AZUL_CLARO)
        
        # Dibujar tubería
        self.dibujar_tuberia(superficie)
        
        # Dibujar partículas
        for particula in self.particulas:
            particula.dibujar(superficie)
        
        # Panel de información
        self.dibujar_panel_info(superficie)
        
        # Ayuda
        self.dibujar_ayuda(superficie)
        
        # Indicador de pausa
        if self.pausa:
            self.dibujar_texto("⏸ PAUSADO", ANCHO - 150, 20, fuente_normal, ROJO)
    
    def manejar_evento(self, evento):
        """Maneja los eventos del usuario"""
        if evento.type == pygame.KEYDOWN:
            if evento.key == pygame.K_UP:
                self.voltaje = min(15, self.voltaje + 0.5)
            elif evento.key == pygame.K_DOWN:
                self.voltaje = max(0.5, self.voltaje - 0.5)
            elif evento.key == pygame.K_RIGHT:
                self.resistencia = min(15, self.resistencia + 0.5)
            elif evento.key == pygame.K_LEFT:
                self.resistencia = max(0.5, self.resistencia - 0.5)
            elif evento.key == pygame.K_SPACE:
                self.pausa = not self.pausa
            elif evento.key == pygame.K_r:
                self.reiniciar()
            elif evento.key == pygame.K_h:
                self.mostrar_ayuda = not self.mostrar_ayuda
    
    def reiniciar(self):
        """Reinicia la simulación"""
        self.voltaje = 5
        self.resistencia = 5
        self.historia_corriente = []
        self.pausa = False
        self.generar_particulas(100)


# Función principal
def main():
    simulacion = Simulacion()
    corriendo = True
    clock = pygame.time.Clock()
    
    while corriendo:
        # Manejar eventos
        for evento in pygame.event.get():
            if evento.type == pygame.QUIT:
                corriendo = False
            else:
                simulacion.manejar_evento(evento)
        
        # Actualizar simulación
        simulacion.actualizar()
        
        # Dibujar
        simulacion.dibujar(pantalla)
        
        # Actualizar pantalla
        pygame.display.flip()
        clock.tick(60)
    
    pygame.quit()


if __name__ == "__main__":
    main()