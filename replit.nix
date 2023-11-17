{ pkgs }: {
    deps = [
      pkgs.postgresql
        pkgs.nodejs-16_x
        pkgs.cowsay
    ];
}