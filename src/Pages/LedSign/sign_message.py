from os import sep, path

CURRENT_DIR = path.dirname(path.abspath(__file__)) + sep


class SignMessage:
  def __init__(self, data, led_sign_directory=CURRENT_DIR):
    self.led_sign_directory = led_sign_directory
    self.scroll_speed = str(data["scrollSpeed"])
    self.background_color = data["backgroundColor"][1:]
    self.text_color = data["textColor"][1:]
    self.border_color = data["borderColor"][1:]
    self.text = data["text"]

  def hex_to_rgb(self, hex_value):
      return ",".join([str(int(hex_value[i:i+2], 16)) for i in (1, 3, 5)])

  def to_subprocess_command(self):
    return [
        self.led_sign_directory + "sce_sign.exe",
        "--set-speed", self.scroll_speed + ' px/vsync',
        "--set-background-color", self.background_color,
        "--set-font-color", self.text_color,
        "--set-border-color", self.border_color,
        "--set-font-filename", self.led_sign_directory + "10x20.bdf",
        "--set-brightness", "66%", 
        "--set-text", self.text
    ]

  def to_dict(self):
      return {
          "existingMessage": True,
          "scrollSpeed": self.scroll_speed,
          "backgroundColor": '#' + self.background_color,
          "textColor": '#' + self.text_color,
          "borderColor": '#' + self.border_color,
          "text": self.text,
          "success": True
      }
