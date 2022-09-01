## Performance Testing on Daraz Web Application Using JMeter

Test executed for the below mentioned scenario in server https://chaldal.com/.

- 5 Concurrent Request with 0 Loop Count; Avg TPS for Total Samples is ~ 2.20 And Total Concurrent API requested: 40.
- 15 Concurrent Request with 0 Loop Count; Avg TPS for Total Samples is ~ 2.64 And Total Concurrent API requested: 120.
- 25 Concurrent Request with 0 Loop Count; Avg TPS for Total Samples is ~ 2.25 And Total Concurrent API requested: 200.
- 35 Concurrent Request with 0 Loop Count; Avg TPS for Total Samples is ~ 1.85 And Total Concurrent API requested: 280.
- 40 Concurrent Request with 0 Loop Count; Avg TPS for Total Samples is ~ 1.54 And Total Concurrent API requested: 320.

While executed 120 concurrent request, found 2 request got connection timeout and error rate is 1.67%. 

**Summary:** Server can handle almost concurrent 40 API call with almost zero (0) percent error rate.

Please find the details report from the attachment and let me know if you have any further queries.
