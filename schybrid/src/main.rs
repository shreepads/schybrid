/// Copyright (c) 2022 Shreepad Shukla
// SPDX-License-Identifier: AGPL-3.0-only

use clap::Parser;

// Setup the command line arguments and help using Clap

/// Schedule hybrid work teams to ensure each team gets one day together in office
#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {

    /// Total number of seats
    #[clap(short, long, value_parser)]
    seats: u32,

    /// CSV Filename/path with team info
    #[clap(short, long, value_parser)]
    filename: String,

}

fn findoptimalseating(seats: u32, filename: String) -> u8 {
    println!("Finding optimal seating");
    0
}


fn main() {
    let args = Args::parse();

    findoptimalseating(args.seats, args.filename);
}
