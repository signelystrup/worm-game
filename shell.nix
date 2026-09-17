{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_26
    yarn
    typescript
  ];

  shellHook = ''
    echo "Node.js development environment loaded (Node $(node --version), npm $(npm --version))"
  '';
}
