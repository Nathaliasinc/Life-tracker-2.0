// swift-tools-version:5.5
import PackageDescription

let package = Package(
    name: "LifeTracker2",
    platforms: [
        .iOS(.v14),
        .macOS(.v11)
    ],
    products: [
        .library(
            name: "LifeTracker2",
            targets: ["LifeTracker2"]
        ),
    ],
    dependencies: [],
    targets: [
        .target(
            name: "LifeTracker2",
            dependencies: [],
            resources: [
                .process("Resources")
            ]
        ),
        .testTarget(
            name: "LifeTracker2Tests",
            dependencies: ["LifeTracker2"]
        ),
    ]
)
