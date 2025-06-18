import chalk from "chalk";

class Logger {
  constructor(level = "info") {
    this.levels = ["debug", "info", "warn", "error"];
    this.currentLevelIndex = this.levels.indexOf(level);
    this.bgColors = {
      debug: chalk.bgBlue,
      info: chalk.bgGreen,
      warn: chalk.bgYellow,
      error: chalk.bgRed,
    };
  }

  log(level, message, ...optionalParams) {
    const levelIndex = this.levels.indexOf(level);
    if (levelIndex >= this.currentLevelIndex) {
      const timestamp = new Date().toLocaleTimeString();
      console[level](
        `${this.bgColors[level](`[${level.toUpperCase()}]`)} ${chalk.gray(timestamp)} - ${message}`,
        ...optionalParams
      );
    }
  }

  debug(msg, ...params) {
    this.log("debug", msg, ...params);
  }

  info(msg, ...params) {
    this.log("info", msg, ...params);
  }

  warn(msg, ...params) {
    this.log("warn", msg, ...params);
  }

  error(msg, ...params) {
    this.log("error", msg, ...params);
  }

  setLevel(level) {
    if (this.levels.includes(level)) {
      this.currentLevelIndex = this.levels.indexOf(level);
    }
  }
}

// Usage
export default new Logger("debug");
